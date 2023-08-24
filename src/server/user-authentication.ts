import db from './database';
import {saveSession} from './session/session';

import argon2 from 'argon2';

export async function loginUser(email: string, password: string): Promise<boolean> {
	const userId = await db.getUserId(email);
	if (!userId) return false;

	const realPassword = await db.getUserPassword(userId);
	if (!realPassword) return false;

	const isPasswordCorrect = await argon2.verify(realPassword, password);

	if (isPasswordCorrect) saveSession(userId);
	return isPasswordCorrect;
}

export async function createUser(id: string, username: string, email: string, password: string) {
	const hashedPassword = await argon2.hash(password);
	await db.createUser(id, username, email, hashedPassword);
	saveSession(id);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
	const realPassword = await db.getUserPassword(userId);
	if (!realPassword) return false;

	const isPasswordCorrect = await argon2.verify(realPassword, currentPassword);
	if (!isPasswordCorrect) return false;

	const hashedPassword = await argon2.hash(newPassword);
	db.changeUserPassword(userId, hashedPassword);

	return true;
}
