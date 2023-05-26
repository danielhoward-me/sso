import {Client} from 'pg';

class Database {
	client: Client = new Client({
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		password: process.env.PGPASSWORD,
		database: process.env.PGDATABASE,
		port: Number(process.env.PGPORT) || 5432,
	});

	constructor() {
		this.client.connect();
		this.client.query('SELECT NOW()', (err, res) => {
			console.log(err, res);
		});
	}
}

const db = new Database();
export default db;
