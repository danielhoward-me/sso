'use client';

import {signupPageValidationData} from './../../inputs';
import {UserDetailsInputs, PasswordInputs} from './../components/account-inputs';
import Button from './../components/button';
import Fieldset from './../components/fieldset';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import {useState, useRef} from 'react';

import type {AccountDetailsApiResponse} from './../types.d';
import type {FormEvent} from 'react';

export default function Form({redirect}: {redirect: string}) {
	const [waitingForAuthCode, setWaitingForAuthCode] = useState(false);

	const [usernameError, setUsernameError] = useState('');
	const [emailError, setEmailError] = useState('');

	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	const [buttonLoading, setButtonLoading] = useState(false);

	const [errorText, setErrorText] = useState('');

	const formRef = useRef<HTMLFormElement>(null);

	async function onUserCreateSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setButtonLoading(true);

		const validData = runValidation(signupPageValidationData, {
			username: setUsernameError,
			email: setEmailError,
			password: setPasswordError,
			confirmPassword: setConfirmPasswordError,
		}, formRef.current);
		if (validData === null) {
			setButtonLoading(false);
			return;
		}

		try {
			const createUserOutcome = await makeApiRequest<AccountDetailsApiResponse>('signup', validData);
			if (createUserOutcome.successful) {
				setWaitingForAuthCode(true);
				console.log(createUserOutcome.userId);
				return;
			} else {
				if (createUserOutcome.usernameExists) {
					setUsernameError('This username is already in use. Please choose a different one.');
				}
				if (createUserOutcome.emailExists) {
					setEmailError('This email is already in use. Please choose a different one.');
				}
			}
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting to create your account. Please try again later.');
		}

		setButtonLoading(false);
	}

	return (
		(waitingForAuthCode ? (
			<p>test</p>
		) : (
			<form className="max-w-lg mx-auto space-y-2 mt-6" onSubmit={onUserCreateSubmit} ref={formRef}>
				<Fieldset title="Account Details">
					<UserDetailsInputs usernameError={usernameError} emailError={emailError}/>
					<br/>
				</Fieldset>

				<Fieldset title="Password">
					<PasswordInputs passwordError={passwordError} confirmPasswordError={confirmPasswordError}/>
					<br/>
				</Fieldset>

				{errorText && <p className="text-red-500 text-center mt-4">{errorText}</p>}

				<Button className="mx-auto !mt-4" type="submit" loading={buttonLoading}>
					Create Account
				</Button>
			</form>
		))
	);
}
