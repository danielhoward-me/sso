import {LoginTarget} from './../constants';

import {Client} from 'pg';

import type {LoginPageData, LoginPages} from './../types';
import type {QueryResult} from 'pg';

class Database {
	private client: Client = new Client({
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		password: process.env.PGPASSWORD,
		database: process.env.PGDATABASE,
		port: Number(process.env.PGPORT) || 5432,
	});
	private connectPromise: Promise<void> | null;

	public constructor() {
		this.connect();
	}

	private async connect() {
		console.log('Connecting to database');
		try {
			this.connectPromise = this.client.connect();
			await this.connectPromise;
			console.log('Connected to database');
			this.connectPromise = null;
		} catch (err) {
			console.error('Error connecting to database', err);
		}
	}

	public async waitForConnection() {
		if (this.connectPromise) {
			await this.connectPromise;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async query<T>(sql: string, values?: any[]): Promise<QueryResult<T>> {
		if (process.env.NODE_ENV !== 'production') {
			const sqlQuery = sql.split('\n').map((line) => '\t' + line).join('\n');
			console.log('Querying database:');
			console.log(sqlQuery);
			if (values) {
				console.log('With values:');
				console.log(values);
			}
		}

		return this.client.query<T>(sql, values);
	}

	public async close() {
		if (process.env.NODE_ENV !== 'production') {
			console.log('Closing database connection');
		}

		await this.client.end();
	}

	public async getLoginPages(): Promise<LoginPages> {
		const res = await this.query<LoginPageData>(
			'SELECT slug, page_name, login_target FROM login_pages'
		);
		const loginPages: LoginPages = {};
		for (const row of res.rows) {
			loginPages[row.slug] = {
				pageName: row.page_name,
				loginTarget: LoginTarget[row.login_target],
			};
		}
		return loginPages;
	}
}

const db = new Database();
export default db;
