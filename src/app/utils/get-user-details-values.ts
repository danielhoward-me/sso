import type {ProfilePictureType} from './../../constants';
import type User from './../../server/user';

export interface UserDetailsValues {
	username: string;
	email: string;
	profilePicture: ProfilePictureType;
	emailHash: string;
	profilePictureUrl: string;
}

export default function getUserDetailsValues(user: User): UserDetailsValues {
	return {
		username: user.username,
		email: user.email,
		profilePicture: user.profilePicture,
		emailHash: user.emailHash,
		profilePictureUrl: user.getProfilePictureUrl(),
	};
}
