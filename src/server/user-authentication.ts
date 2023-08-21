import db from './database';
import {saveSession} from './session';

import argon2 from 'argon2';

export async function loginUser(email: string, password: string): Promise<boolean> {
	const userData = await db.getUserLoginData(email);
	if (!userData) return false;

	const isPasswordCorrect = await argon2.verify(userData.password, password);

	if (isPasswordCorrect) saveSession(userData.id);
	return isPasswordCorrect;
}

export async function createUser(id: string, username: string, email: string, password: string) {
	const hashedPassword = await argon2.hash(password);
	await db.createUser(id, username, email, hashedPassword);
	saveSession(id);
}
