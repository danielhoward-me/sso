import db from './../../src/server/database';

import {readFileSync} from 'fs';

const files = [
	'schema',
	'data',
];

async function main() {
	await db.waitForConnection();

	const databaseName = process.env.PGDATABASE;
	const databaseUser = process.env.PGUSER;
	console.log(`Reseting database ${databaseName}`);
	await db.query(`drop owned by ${databaseUser};`);

	for (const file of files) {
		const filename = `${file}.sql`;
		console.log(`Running ${filename}`);
		const sql = readFileSync(`./sql/${filename}`).toString();
		await db.query(sql);
	}

	db.close();
}

main();
