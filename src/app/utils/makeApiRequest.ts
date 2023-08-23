export default async function makeApiRequest<T>(route: string, body: {[key: string]: string}): Promise<T> {
	const response = await fetch(`/api/${route}`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to make request to api ${route} route`);
	}

	return await response.json();
}
