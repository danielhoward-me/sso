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
