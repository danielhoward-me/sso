import db from './database';
import {ProfilePictureType} from './types.d';

import {createHash} from 'crypto';

export default class User {
	private loaded = false;
	private loadPromise: Promise<void> | null = null;

	id: string;
	username: string;
	email: string;
	profilePicture: ProfilePictureType;
	created: Date;
	last_updated: Date;
	emailHash: string;

	constructor(id: string) {
		this.id = id;
		this.loadPromise = this.load();
	}

	async load() {
		if (this.loaded) return;

		const rawUser = await db.getUser(this.id);
		if (!rawUser) throw new Error(`User ${this.id} not found`);

		this.username = rawUser.username;
		this.email = rawUser.email;
		this.profilePicture = rawUser.profile_picture;
		this.created = new Date(rawUser.created);
		this.last_updated = new Date(rawUser.last_updated);

		this.emailHash = createHash('md5').update(this.email).digest('hex');

		this.loaded = true;
	}

	async waitForLoad() {
		if (this.loaded || !this.loadPromise) return;

		await this.loadPromise;
	}

	getProfilePictureUrl(forceType?: ProfilePictureType) {
		if (!this.loaded) throw new Error('User not loaded');

		const profilePictureType = forceType || this.profilePicture;
		const queryString = `?d=${profilePictureType === ProfilePictureType.Custom ? 'mp' : `${profilePictureType}&f=y`}`;
		return `https://www.gravatar.com/avatar/${this.emailHash}${queryString}`;
	}
}
