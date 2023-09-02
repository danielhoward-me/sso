import {userDetailsValidationData} from './../../inputs';
import {UserDetailsInputs} from './../components/account-inputs';
import Button from './../components/button';
import {changeUsername} from './../navbar-elements';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import {useRef, useState} from 'react';

import type {AccountDetailsApiResponse} from './../types.d';
import type {FormEvent} from 'react';

interface Props {
	username: string;
	email: string;
}

export default function AccountDetailsSection({username, email}: Props) {
	const [usernameError, setUsernameError] = useState('');
	const [emailError, setEmailError] = useState('');

	const [buttonLoading, setButtonLoading] = useState(false);

	const [errorText, setErrorText] = useState('');
	const [successText, setSuccessText] = useState('');

	const formRef = useRef<HTMLFormElement>(null);

	async function onUserDetailsSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setButtonLoading(true);
		setSuccessText('');
		setErrorText('');

		const validData = runValidation(userDetailsValidationData, {
			username: setUsernameError,
			email: setEmailError,
		}, formRef.current);
		if (validData === null) {
			setButtonLoading(false);
			return;
		}

		try {
			const editUserDetailsOutcome = await makeApiRequest<AccountDetailsApiResponse>('edituserdetails', validData);
			if (editUserDetailsOutcome.successful) {
				changeUsername(validData.username);
				setSuccessText('Successfully updated your account details');
			} else {
				if (editUserDetailsOutcome.usernameExists) {
					setUsernameError('This username is already in use. Please choose a different one.');
				}
				if (editUserDetailsOutcome.emailExists) {
					setEmailError('This email is already in use. Please choose a different one.');
				}
			}
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting to edit your details. Please try again later.');
		}

		setButtonLoading(false);
	}

	return (
		<form className="space-y-2" onSubmit={onUserDetailsSubmit} ref={formRef}>
			<UserDetailsInputs username={username} email={email} usernameError={usernameError} emailError={emailError}/>

			{errorText && <p className="text-red-500 text-center mt-4">{errorText}</p>}
			{successText && <p className="text-green-600 text-center mt-4">{successText}</p>}

			<Button className="mx-auto !mt-4" type="submit" loading={buttonLoading}>
				Save Details
			</Button>
		</form>
	);
}
