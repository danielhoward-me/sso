import {Client} from 'pg';

import type {RawSession, RawUser, UserLoginData} from './types.d';
import type {QueryResult, QueryResultRow} from 'pg';

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
	public async query<T extends QueryResultRow>(sql: string, values?: any[]): Promise<QueryResult<T>> {
		if (process.env.NODE_ENV !== 'production' && process.env.LOG_QUERIES === 'true') {
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

	public async getSession(sessionId: string): Promise<RawSession | undefined> {
		const {rows} = await this.query<RawSession>(
			'SELECT * FROM sessions WHERE id = $1',
			[sessionId],
		);

		return rows[0];
	}

	public async createSession(sessionId: string, ip: string, maxAge: number) {
		await this.query(
			`INSERT INTO sessions (id, ip, expires) VALUES ($1, $2, NOW() + INTERVAL '${maxAge} seconds')`,
			[sessionId, ip],
		);
	}

	public async deleteSession(sessionId: string) {
		await this.query(
			'DELETE FROM sessions WHERE id = $1',
			[sessionId],
		);
	}

	public async updateSession(sessionId: string, userId: string) {
		await this.query(
			'UPDATE sessions SET user_id = $1 WHERE id = $2',
			[userId, sessionId],
		);
	}

	public async getUser(userId: string): Promise<RawUser> {
		const {rows} = await this.query<RawUser>(
			'SELECT id, username, email, created, updated FROM users WHERE id = $1',
			[userId],
		);

		return rows[0];
	}

	public async getUserLoginData(email: string): Promise<UserLoginData> {
		const {rows} = await this.query<UserLoginData>(
			`SELECT id, password FROM users WHERE email = $1`,
			[email],
		);

		return rows[0];
	}
}

const db = new Database();
export default db;
