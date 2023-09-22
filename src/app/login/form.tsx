'use client';

import {loginPageValidationData} from './../../inputs';
import Button from './../components/button';
import TextInput from './../components/input';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import {useState, useRef} from 'react';

import type {BasicApiResponse} from './../types.d';
import type {FormEvent} from 'react';

export default function LoginForm({redirect, navbarHidden}: {redirect: string, navbarHidden: boolean}) {
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [errorText, setErrorText] = useState('');

	const [buttonLoading, setButtonLoading] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	async function onLoginSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setButtonLoading(true);
		setErrorText('');

		const validData = runValidation(loginPageValidationData, {
			email: setEmailError,
			password: setPasswordError,
		}, formRef.current);
		if (validData === null) {
			setButtonLoading(false);
			return;
		}

		try {
			const {successful} = await makeApiRequest<BasicApiResponse>('login', validData);

			if (successful) {
				window.location.href = redirect;
				return;
			} else {
				setErrorText('The email or password you entered is incorrect.');
			}
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting you log you in. Please try again later.');
		}

		setButtonLoading(false);
	}

	return (
		<form className="max-w-lg mx-auto space-y-6 mt-8" onSubmit={onLoginSubmit} ref={formRef}>
			<TextInput
				label="Email"
				id="email"
				name="email"
				placeholder="you@example.com"
				type="text"
				tabIndex={1}
				error={emailError}
			/>
			<TextInput
				label="Password"
				labelLink={{href: `/password-reset${navbarHidden ? `?hidenavbar` : ''}`, text: 'Forgot password?'}}
				id="password"
				name="password"
				placeholder="Password"
				type="password"
				tabIndex={2}
				error={passwordError}
			/>
			{errorText && <p className="text-red-500 text-center mt-4">{errorText}</p>}
			<Button className="mx-auto mt-8" type="submit" loading={buttonLoading}>
				Log in
			</Button>
		</form>
	);
}
