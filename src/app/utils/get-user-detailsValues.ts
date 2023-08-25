import type User from './../../server/user';

export interface UserDetailsValues {
	username: string;
	email: string;
	profilePicture: string;
}

export default function getUserDetailsValues(user: User): UserDetailsValues {
	return {
		username: user.username,
		email: user.email,
		profilePicture: user.getProfilePictureUrl(),
	};
}
