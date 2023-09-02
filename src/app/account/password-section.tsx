import {changePasswordValidationData} from './../../inputs';
import {PasswordInputs} from './../components/account-inputs';
import Button from './../components/button';
import TextInput from './../components/input';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import {useRef, useState} from 'react';

import type {BasicApiResponse} from './../types.d';
import type {FormEvent} from 'react';

export default function PasswordSection() {
	const [currentPasswordError, setCurrentPasswordError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	const [buttonLoading, setButtonLoading] = useState(false);

	const [errorText, setErrorText] = useState('');
	const [successText, setSuccessText] = useState('');

	const changePasswordFormRef = useRef<HTMLFormElement>(null);

	async function onChangePasswordSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setButtonLoading(true);
		setSuccessText('');
		setErrorText('');

		const validData = runValidation(changePasswordValidationData, {
			currentPassword: setCurrentPasswordError,
			password: setPasswordError,
			confirmPassword: setConfirmPasswordError,
		}, changePasswordFormRef.current);
		if (validData === null) {
			setButtonLoading(false);
			return;
		}

		try {
			const {successful} = await makeApiRequest<BasicApiResponse>('user/password', validData);
			if (successful) {
				setSuccessText('Successfully updated your password');

				// Clear the password inputs
				changePasswordFormRef.current?.querySelectorAll('input').forEach((input) => {
					input.value = '';
				});
			} else {
				setCurrentPasswordError('This password does not match your current password');
			}
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting to change your password. Please try again later.');
		}

		setButtonLoading(false);
	}

	return (
		<form onSubmit={onChangePasswordSubmit} ref={changePasswordFormRef}>
			<TextInput
				label="Current Password"
				id="currentPassword"
				name="currentPassword"
				placeholder="Password"
				error={currentPasswordError}
				type="password"
			/>
			<PasswordInputs labelPrefix="New " passwordError={passwordError} confirmPasswordError={confirmPasswordError}/>

			{errorText && <p className="text-red-500 text-center mt-4">{errorText}</p>}
			{successText && <p className="text-green-600 text-center mt-4">{successText}</p>}

			<Button className="mx-auto !mt-4" type="submit" loading={buttonLoading}>
				Update Password
			</Button>
		</form>
	);
}
