import db from './database';

import {createHash} from 'crypto';

import type {RawUser} from './types.d';

export default class User {
	loaded = false;
	dbPromise: Promise<RawUser> | null = null;

	readonly id: string;
	username: string;
	email: string;
	created: Date;
	updated: Date;

	constructor(id: string) {
		this.id = id;
		this.load();
	}

	async load() {
		if (this.loaded) return;

		this.dbPromise = db.getUser(this.id);
		const rawUser = await this.dbPromise;
		if (!rawUser) throw new Error(`User ${this.id} not found`);

		this.username = rawUser.username;
		this.email = rawUser.email;
		this.created = new Date(rawUser.created);
		this.updated = new Date(rawUser.updated);

		this.loaded = true;
	}

	async waitForLoad() {
		if (this.loaded || !this.dbPromise) return;

		await this.dbPromise;
	}

	getProfilePictureUrl() {
		if (!this.loaded) throw new Error('User not loaded');

		const emailHash = createHash('md5').update(this.email).digest('hex');

		return `https://www.gravatar.com/avatar/${emailHash}?d=wavatar`;
	}
}
