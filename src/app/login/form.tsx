'use client';

import {loginPageValidationData} from './../../inputs';
import validate from './../../validate';
import Button from './../components/button';
import {TextInput} from './../components/input';

import {useRouter} from 'next/navigation';
import {useState} from 'react';

import type {FormEvent} from 'react';

interface Props {
	redirect: string;
}

export default function LoginForm({redirect}: Props) {
	const router = useRouter();

	const [loggingIn, setLoggingIn] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [errorText, setErrorText] = useState('');

	async function onLoginSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoggingIn(true);
		setEmailError('');
		setPasswordError('');
		setErrorText('');

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const body = Object.fromEntries(formData) as {[key: string]: string};

		const validationErrors = validate(loginPageValidationData, body);
		if (Object.keys(validationErrors).length > 0) {
			setEmailError(validationErrors.email ?? '');
			setPasswordError(validationErrors.password ?? '');
			setLoggingIn(false);
			return;
		}

		try {
			const loggedIn = await login(body);

			if (loggedIn) {
				router.push(redirect);
				return;
			} else {
				setErrorText('The email or password you entered is incorrect.');
			}
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting you log you in. Please try again later.');
		}

		setLoggingIn(false);
	}

	return (
		<form className="max-w-lg mx-auto" onSubmit={onLoginSubmit}>
			<div className="mt-8">
				<TextInput
					label="Email"
					id="email"
					name="email"
					placeholder="you@example.com"
					type="text"
					tabIndex={1}
					error={emailError}
				/>
			</div>
			<div className="mt-6">
				<TextInput
					label="Password"
					labelLink={{href: `/password-reset`, text: 'Forgot password?'}}
					id="password"
					name="password"
					placeholder="Password"
					type="password"
					tabIndex={2}
					error={passwordError}
				/>
			</div>
			{errorText && <p className="text-red-500 text-center mt-4">{errorText}</p>}
			<Button className="mx-auto mt-8" type="submit" loading={loggingIn}>
				Log in
			</Button>
		</form>
	);
}

async function login(body: {[key: string]: string}) {
	const response = await fetch('/api/login', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error();
	}

	const {successful} = await response.json();
	return successful;
}
