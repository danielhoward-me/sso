'use client';

import Button from './../components/button';
import makeApiRequest from './../utils/make-api-request';

import {useState} from 'react';

import type {AuthApiResponse} from './../types.d';

export default function Buttons({target, devPort}: {target: string, devPort: string}) {
	const [errorText, setErrorText] = useState('');
	const [buttonLoading, setButtonLoading] = useState(false);

	async function authorise() {
		setButtonLoading(true);
		setErrorText('');

		try {
			const {redirect} = await makeApiRequest<AuthApiResponse>('oauth2/auth', {target, devPort});
			window.location.href = redirect;
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting to run authorisation. Please try again later.');
		}

		setButtonLoading(false);
	}
	function cancel() {
		if (window.opener) {
			window.close();
		} else {
			window.history.go(-1);
		}
	}

	return (
		<>
			{errorText && <p className="text-red-500 text-center">{errorText}</p>}
			<Button buttonStyle="success" className="w-full" onClick={authorise} loading={buttonLoading}>Authorise</Button>
			<Button buttonStyle="outline" className="w-full" onClick={cancel}>Cancel</Button>
		</>
	);
}
