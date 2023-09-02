import {ProfilePictureType} from './../constants';

export default function constructProfilePicture(type: ProfilePictureType, emailHash: string): string {
	const queryString = `?d=${type === ProfilePictureType.Custom ? 'mp' : `${type}&f=y`}`;
	return `https://www.gravatar.com/avatar/${emailHash}${queryString}`;
}
