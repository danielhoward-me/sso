import {EMAIL_AUTH_CODE_EXPIRES_MINUTES, RESET_PASSWORD_TOKEN_EXPIRES_MINUTES} from './../constants';
import constructProfilePicture from './construct-profile-picture';
import db from './database';
import email, {EmailTemplate} from './email';

import argon2 from 'argon2';
import {createHash} from 'crypto';
import {v4 as uuid} from 'uuid';

import type {ProfilePictureType} from './../constants';

export default class User {
	private loaded = false;
	private loadPromise: Promise<void> | null = null;

	id: string;
	username: string;
	email: string;
	profilePicture: ProfilePictureType;
	created: Date;
	lastUpdated: Date;
	emailHash: string;
	authCode: string;
	authCodeExpires: Date;
	passwordResetToken: string;
	passwordResetTokenExpires: Date;
	admin: boolean;

	constructor(id: string) {
		this.id = id;
		this.loadPromise = this.load();
	}

	private async load() {
		if (this.loaded) return;

		const rawUser = await db.getUser(this.id);
		if (!rawUser) throw new Error(`User ${this.id} not found`);

		this.username = rawUser.username;
		this.email = rawUser.email;
		this.profilePicture = rawUser.profile_picture;
		this.created = new Date(parseInt(rawUser.created) * 1000);
		this.lastUpdated = new Date(parseInt(rawUser.last_updated) * 1000);
		this.authCode = rawUser.auth_code;
		this.authCodeExpires = new Date(parseInt(rawUser.auth_code_expires) * 1000);
		this.passwordResetToken = rawUser.password_reset_token;
		this.passwordResetTokenExpires = new Date(parseInt(rawUser.password_reset_token_expires) * 1000);
		this.admin = rawUser.admin;

		this.emailHash = createHash('md5').update(this.email).digest('hex');

		this.loaded = true;
	}

	// This is required to avoid waitForLoad being run manually every time
	public static async get(userId: string): Promise<User> {
		const user = new User(userId);
		await user.waitForLoad();
		return user;
	}

	private async waitForLoad() {
		if (this.loaded || !this.loadPromise) return;

		await this.loadPromise;
	}

	public getProfilePictureUrl(forceType?: ProfilePictureType): string {
		if (!this.loaded) throw new Error('User not loaded');

		const type = forceType || this.profilePicture;
		return constructProfilePicture(type, this.emailHash);
	}

	public async newUsernameExists(username: string): Promise<boolean> {
		return await db.entryExists('users', {field: 'username', value: username}, {field: 'id', negate: true, value: this.id});
	}

	public async newEmailExists(email: string): Promise<boolean> {
		return await db.entryExists('users', {field: 'email', value: email}, {field: 'id', negate: true, value: this.id});
	}

	public async editDetails(username: string, email: string) {
		await db.editUserDetails(this.id, username, email);
	}

	public async changePassword(password: string) {
		const hashedPassword = await argon2.hash(password);
		await db.changeUserPassword(this.id, hashedPassword);
	}

	public async isPasswordCorrect(password: string): Promise<boolean> {
		const realPassword = await db.getUserPassword(this.id);
		if (!realPassword) return false;

		return await argon2.verify(realPassword, password);
	}

	public async changeProfilePicture(profilePicture: ProfilePictureType) {
		await db.changeProfilePicture(this.id, profilePicture);
	}

	public async generateAuthCode() {
		const authCode = User.makeAuthCode();

		await db.setUserAuthCode(this.id, authCode, EMAIL_AUTH_CODE_EXPIRES_MINUTES * 60);

		email.sendTemplate(`${this.username} <${this.email}>`, EmailTemplate.ConfirmEmail, {
			username: this.username,
			expiryTime: EMAIL_AUTH_CODE_EXPIRES_MINUTES,
			confirmCode: authCode,
		});
	}

	public async isCorrectAuthCode(authCode: string): Promise<boolean> {
		if (!this.authCode) return false;
		if (Date.now() > this.authCodeExpires.getTime()) {
			this.generateAuthCode();
			return false;
		}

		const correct = authCode === this.authCode;
		if (correct) {
			await db.clearUserAuthCode(this.id);
		}

		return correct;
	}

	public async sendPasswordResetEmail() {
		const resetToken = uuid();

		await db.setUserPasswordResetToken(this.id, resetToken, RESET_PASSWORD_TOKEN_EXPIRES_MINUTES * 60);

		const isDev = process.env.NODE_ENV === 'development';
		email.sendTemplate(`${this.username} <${this.email}>`, EmailTemplate.ResetPassword, {
			username: this.username,
			expiryTime: RESET_PASSWORD_TOKEN_EXPIRES_MINUTES,
			resetPasswordLink: `http${isDev ? '' : 's'}://${isDev ? 'local' : 'sso'}.danielhoward.me${isDev ? ':3000' : ''}/reset-password?token=${resetToken}`,
		});
	}

	public async deletePasswordResetToken() {
		await db.deletePasswordResetToken(this.id);

		this.passwordResetToken = '';
		this.passwordResetTokenExpires = new Date(0);
	}

	public static async sendPasswordResetEmail(email: string) {
		const userId = await db.getUserId(email);
		if (!userId) return;

		const user = await User.get(userId);
		await user.sendPasswordResetEmail();
	}

	public static async getUserWithPasswordResetToken(token: string): Promise<User | undefined> {
		const userId = await db.getUserWithPasswordResetToken(token);
		if (!userId) return undefined;

		const user = await User.get(userId);
		if (Date.now() > user.passwordResetTokenExpires.getTime()) {
			user.deletePasswordResetToken();
			return undefined;
		}

		return user;
	}

	public static async idExists(id: string): Promise<boolean> {
		return await db.entryExists('users', {field: 'id', value: id});
	}

	public static async usernameExists(username: string): Promise<boolean> {
		return await db.entryExists('users', {field: 'username', value: username});
	}

	public static async emailExists(email: string): Promise<boolean> {
		return await db.entryExists('users', {field: 'email', value: email});
	}

	public static async checkCredentials(email: string, password: string): Promise<User | null> {
		const userId = await db.getUserId(email);
		if (!userId) return null;

		const user = await User.get(userId);
		return (await user.isPasswordCorrect(password)) ? user : null;
	}

	public static async create(username: string, emailValue: string, password: string): Promise<User> {
		let id = '';
		while (id === '' || await User.idExists(id)) {
			id = uuid();
		}

		const hashedPassword = await argon2.hash(password);

		await db.createUser(id, username, emailValue, hashedPassword);

		const user = await User.get(id);

		await user.generateAuthCode();

		return user;
	}

	private static makeAuthCode(): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let out = '';

		for (let i = 0; i < 7; i++) {
			if (i === 3) {
				out += '-';
				continue;
			}

			const randCharacter = Math.floor(Math.random() * characters.length);
			out += characters[randCharacter];
		}

		return out;
	}
}
