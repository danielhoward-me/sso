'use client';

import {resetPasswordValidationData} from './../../inputs';
import {PasswordInputs} from './../components/account-inputs';
import Button from './../components/button';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import {useRef, useState} from 'react';

import type {BasicApiResponse} from './../types.d';
import type {FormEvent} from 'react';

export default function PasswordForm({token}: {token: string}) {
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	const [buttonLoading, setButtonLoading] = useState(false);

	const [errorText, setErrorText] = useState('');

	const formRef = useRef<HTMLFormElement>(null);

	async function changePassword(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setButtonLoading(true);
		setErrorText('');

		const validData = runValidation(resetPasswordValidationData, {
			password: setPasswordError,
			confirmPassword: setConfirmPasswordError,
		}, formRef.current);
		if (validData === null) {
			setButtonLoading(false);
			return;
		}

		try {
			const {successful} = await makeApiRequest<BasicApiResponse>('reset-password', validData);
			if (successful) {
				window.location.href = '/login';
				return;
			} else {
				throw new Error('Api returned non ok response');
			}
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting to reset your password. Please try again later.');
		}

		setButtonLoading(false);
	}

	return (
		<>
			<br/>
			<form className="max-w-md mx-auto space-y-2" onSubmit={changePassword} ref={formRef}>
				<PasswordInputs labelPrefix="New " passwordError={passwordError} confirmPasswordError={confirmPasswordError}/>
				<input className="hidden" name="token" type="text" value={token} readOnly/>
				{errorText && <p className="text-red-500 text-center mt-4">{errorText}</p>}
				<Button className="mx-auto !mt-4" type="submit" loading={buttonLoading}>Change Password</Button>
			</form>
		</>
	);
}
