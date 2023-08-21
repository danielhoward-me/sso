import type User from './../../server/user';

export interface UserDetailsValues {
	username: string;
	email: string;
}

export default function getUserDetailsValues(user: User | null): UserDetailsValues | null {
	if (user === null) return null;

	return {
		username: user.username,
		email: user.email,
	};
}
