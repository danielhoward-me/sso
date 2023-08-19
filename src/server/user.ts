import db from './database';

import {createHash} from 'crypto';

export default class User {
	private loaded = false;
	private loadPromise: Promise<void> | null = null;

	id: string;
	username: string;
	email: string;
	created: Date;
	updated: Date;

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
		this.created = new Date(rawUser.created);
		this.updated = new Date(rawUser.updated);

		this.loaded = true;
	}

	async waitForLoad() {
		if (this.loaded || !this.loadPromise) return;

		await this.loadPromise;
	}

	getProfilePictureUrl() {
		if (!this.loaded) throw new Error('User not loaded');

		const emailHash = createHash('md5').update(this.email).digest('hex');

		return `https://www.gravatar.com/avatar/${emailHash}?d=wavatar`;
	}
}
