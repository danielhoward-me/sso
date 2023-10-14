'use client';

import {resetPasswordEmailValidationData} from './../../inputs';
import Button from './../components/button';
import TextInput from './../components/input';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import {useRef, useState} from 'react';

import type {BasicApiResponse} from './../types.d';
import type {FormEvent} from 'react';

export default function EmailForm() {
	const [errorText, setErrorText] = useState('');
	const [successText, setSuccessText] = useState('');

	const [emailError, setEmailError] = useState('');

	const [buttonLoading, setButtonLoading] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	async function onEmailSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setButtonLoading(true);
		setErrorText('');

		const validData = runValidation(resetPasswordEmailValidationData, {
			email: setEmailError,
		}, formRef.current);
		if (validData === null) {
			setButtonLoading(false);
			return;
		}

		try {
			await makeApiRequest<BasicApiResponse>('reset-password-email', validData);
			setSuccessText('An email has been sent to the given email with a password reset link if an account exists on the system.');
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting to send a password reset email. Please try again later.');
		}

		setButtonLoading(false);
	}

	return (
		<form className="max-w-lg mx-auto space-y-4" onSubmit={onEmailSubmit} ref={formRef}>
			<TextInput
				label="Email"
				id="email"
				name="email"
				placeholder="you@example.com"
				type="text"
				tabIndex={1}
				error={emailError}
			/>
			{errorText && <p className="text-red-500 text-center">{errorText}</p>}
			{successText && <p className="text-green-600 text-center">{successText}</p>}
			<Button className="mx-auto" type="submit" loading={buttonLoading}>
				Send Password Reset Email
			</Button>
		</form>
	);
}
