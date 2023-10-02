import {USER_AUTH_CODE_EXPIRES_MINUTES} from './../constants';
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

		this.emailHash = createHash('md5').update(this.email).digest('hex');

		this.loaded = true;
	}

	public async waitForLoad() {
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

		await db.setUserAuthCode(this.id, authCode, USER_AUTH_CODE_EXPIRES_MINUTES * 60);

		email.sendTemplate(`${this.username} <${this.email}>`, EmailTemplate.ConfirmEmail, {
			username: this.username,
			expiryTime: USER_AUTH_CODE_EXPIRES_MINUTES,
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

	public static async idExists(id: string): Promise<boolean> {
		return await db.entryExists('users', {field: 'id', value: id});
	}

	public static async usernameExists(username: string): Promise<boolean> {
		return await db.entryExists('users', {field: 'username', value: username});
	}

	public static async emailExists(email: string): Promise<boolean> {
		return await db.entryExists('users', {field: 'email', value: email});
	}

	public static async get(email: string, password: string): Promise<User | null> {
		const userId = await db.getUserId(email);
		if (!userId) return null;

		const user = new User(userId);
		await user.waitForLoad();
		return (await user.isPasswordCorrect(password)) ? user : null;
	}

	public static async create(username: string, emailValue: string, password: string): Promise<User> {
		let id = '';
		while (id === '' || await User.idExists(id)) {
			id = uuid();
		}

		const hashedPassword = await argon2.hash(password);

		await db.createUser(id, username, emailValue, hashedPassword);

		const user = new User(id);
		await user.waitForLoad();

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
