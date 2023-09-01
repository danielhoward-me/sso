import db from './../../src/server/database';

import {readFileSync} from 'fs';

const files = [
	'schema',
	'data',
];

async function main() {
	await db.waitForConnection();
	await db.changeDatabase('postgres');

	const databaseName = process.env.PGDATABASE || '';

	console.log(`Reseting database ${databaseName}`);
	await db.query(`DROP DATABASE ${databaseName};`);
	await db.query(`CREATE DATABASE ${databaseName}`);

	await db.changeDatabase(databaseName);

	for (const file of files) {
		const filename = `${file}.sql`;
		console.log(`Running ${filename}`);
		const sql = readFileSync(`./sql/${filename}`).toString();
		await db.query(sql);
	}

	db.close();
}

main();
