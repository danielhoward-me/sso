'use client';

import {SIGNUP_PLACEHOLDER_USERNAMES} from './../../constants';
import {signupPageValidationData, userDetailsValidationData, changePasswordValidationData} from './../../inputs';
import validate from './../../validate';
import {changeUsername} from './../navBarElements';
import makeApiRequest from './../utils/makeApiRequest';
import Button from './button';
import Fieldset from './fieldset';
import {TextInput} from './input';

import Image from 'next/image';
import {useRef, useState} from 'react';

import type {ValidationData} from './../../validate';
import type {AccountDetailsApiResponse, BasicApiResponse} from './../types.d';
import type {UserDetailsValues} from './../utils/getUserDetailsValues';
import type {FormEvent} from 'react';


interface UserDetailsProps {
	user: UserDetailsValues | null;
	redirect?: string;
}

export default function UserDetails({user, redirect}: UserDetailsProps) {
	const [usernameError, setUsernameError] = useState('');
	const [emailError, setEmailError] = useState('');

	const [currentPasswordError, setCurrentPasswordError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	const [userDetailsButtonLoading, setUserDetailsButtonLoading] = useState(false);
	const [changePasswordButtonLoading, setChangePasswordButtonLoading] = useState(false);
	const [userCreateButtonLoading, setUserCreateButtonLoading] = useState(false);

	const [userDetailsErrorText, setUserDetailsErrorText] = useState('');
	const [changePasswordErrorText, setChangePasswordErrorText] = useState('');
	const [userCreateErrorText, setUserCreateErrorText] = useState('');

	const [userDetailsSuccessText, setUserDetailsSuccessText] = useState('');
	const [changePasswordSuccessText, setChangePasswordSuccessText] = useState('');

	const userDetailsFormRef = useRef<HTMLFormElement>(null);
	const changePasswordFormRef = useRef<HTMLFormElement>(null);
	const userCreateFormRef = useRef<HTMLFormElement>(null);

	function resetErrors() {
		setUsernameError('');
		setEmailError('');
		setCurrentPasswordError('');
		setPasswordError('');
		setConfirmPasswordError('');

		setUserDetailsErrorText('');
		setChangePasswordErrorText('');
		setUserCreateErrorText('');

		setUserDetailsSuccessText('');
		setChangePasswordSuccessText('');
	}

	function runValidation(validationData: ValidationData, form: HTMLFormElement | null): {[key: string]: string} {
		if (!form) throw new Error('No form passed for validation');

		const formData = new FormData(form);
		const body = Object.fromEntries(formData) as {[key: string]: string};

		const validationErrors = validate(validationData, body);
		if (Object.keys(validationErrors).length > 0) {
			setUsernameError(validationErrors.username ?? '');
			setEmailError(validationErrors.email ?? '');
			setCurrentPasswordError(validationErrors.currentPassword ?? '');
			setPasswordError(validationErrors.password ?? '');
			setConfirmPasswordError(validationErrors.confirmPassword ?? '');
			return {};
		}

		return body;
	}

	async function onUserDetailsSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		resetErrors();
		setUserDetailsButtonLoading(true);

		const validData = runValidation(userDetailsValidationData, userDetailsFormRef.current);
		if (Object.keys(validData).length === 0) {
			setUserDetailsButtonLoading(false);
			return;
		}

		try {
			const editUserDetailsOutcome = await makeApiRequest<AccountDetailsApiResponse>('edituserdetails', validData);
			if (editUserDetailsOutcome.successful) {
				changeUsername(validData.username);
				setUserDetailsSuccessText('Successfully updated your account details');
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
			setUserDetailsErrorText('There was an error when attempting to edit your details. Please try again later.');
		}

		setUserDetailsButtonLoading(false);
	}

	async function onChangePasswordSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		resetErrors();
		setChangePasswordButtonLoading(true);

		const validData = runValidation(changePasswordValidationData, changePasswordFormRef.current);
		if (Object.keys(validData).length === 0) {
			setChangePasswordButtonLoading(false);
			return;
		}

		try {
			const {successful} = await makeApiRequest<BasicApiResponse>('changepassword', validData);
			if (successful) {
				setChangePasswordSuccessText('Successfully updated your password');

				// Clear the password inputs
				changePasswordFormRef.current?.querySelectorAll('input').forEach((input) => {
					input.value = '';
				});
			} else {
				setCurrentPasswordError('This password does not match your current password');
			}
		} catch (err) {
			console.error(err);
			setChangePasswordErrorText('There was an error when attempting to change your account. Please try again later.');
		}

		setChangePasswordButtonLoading(false);
	}

	async function onUserCreateSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		resetErrors();
		setUserCreateButtonLoading(true);

		const validData = runValidation(signupPageValidationData, userCreateFormRef.current);
		if (Object.keys(validData).length === 0) {
			setUserCreateButtonLoading(false);
			return;
		}

		try {
			const createUserOutcome = await makeApiRequest<AccountDetailsApiResponse>('signup', validData);
			if (createUserOutcome.successful) {
				window.location.href = redirect || '/';
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
			setUserCreateErrorText('There was an error when attempting to create your account. Please try again later.');
		}

		setUserCreateButtonLoading(false);
	}

	const passwordLabel = `${user ? 'New ' : ''}Password`;

	return (
		<div className="space-y-4 mt-6">
			<div className="space-y-3">
				{user ? (
					<div className="space-y-1">
						<div className="max-w-4xl mx-auto">
							<div className="grid grid-cols-1 lg:grid-cols-[auto_301px] space-y-1 lg:space-x-4 lg:space-y-0">
								<Fieldset title="Account Details">
									<form onSubmit={onUserDetailsSubmit} ref={userDetailsFormRef}>
										<UserDetailsInputs username={user.username} email={user.email} usernameError={usernameError} emailError={emailError}/>

										{userDetailsErrorText && <p className="text-red-500 text-center mt-4">{userDetailsErrorText}</p>}
										{userDetailsSuccessText && <p className="text-green-600 text-center mt-4">{userDetailsSuccessText}</p>}

										<Button className="mx-auto !mt-4" type="submit" loading={userDetailsButtonLoading}>
											Save Details
										</Button>
									</form>
								</Fieldset>
								<Fieldset title="Profile Picture">
									<div className="flex justify-center items-center p-5">
										<Image
											src={`${user.profilePicture}&s=200`}
											alt="Account Profile Picture"
											width={200}
											height={200}
											className="rounded-full"
										/>
									</div>
								</Fieldset>
							</div>
						</div>
						<form className="max-w-4xl mx-auto space-y-2" onSubmit={onChangePasswordSubmit} ref={changePasswordFormRef}>
							<Fieldset title="Password">
								<TextInput
									label="Current Password"
									id="currentPassword"
									name="currentPassword"
									placeholder="Password"
									type="password"
									error={currentPasswordError}
								/>
								<PasswordInputs passwordLabel={passwordLabel} passwordError={passwordError} confirmPasswordError={confirmPasswordError}/>

								{changePasswordErrorText && <p className="text-red-500 text-center mt-4">{changePasswordErrorText}</p>}
								{changePasswordSuccessText && <p className="text-green-600 text-center mt-4">{changePasswordSuccessText}</p>}

								<Button className="mx-auto !mt-4" type="submit" loading={changePasswordButtonLoading}>
									Update Password
								</Button>
							</Fieldset>
						</form>
					</div>
				) : (
					<form className="max-w-lg mx-auto space-y-2" onSubmit={onUserCreateSubmit} ref={userCreateFormRef}>
						<Fieldset title="Account Details">
							<UserDetailsInputs usernameError={usernameError} emailError={emailError}/>
							<br/>
						</Fieldset>

						<Fieldset title="Password">
							<PasswordInputs passwordLabel={passwordLabel} passwordError={passwordError} confirmPasswordError={confirmPasswordError}/>
							<br/>
						</Fieldset>

						{userCreateErrorText && <p className="text-red-500 text-center mt-4">{userCreateErrorText}</p>}

						<Button className="mx-auto !mt-4" type="submit" loading={userCreateButtonLoading}>
							Create Account
						</Button>
					</form>
				)}
			</div>
		</div>
	);
}

interface UserDetailsInputsProps {
	username?: string;
	email?: string;
	usernameError: string;
	emailError: string;
}

function UserDetailsInputs({username, email, usernameError, emailError}: UserDetailsInputsProps) {
	return (
		<>
			<TextInput
				label="Username"
				id="username"
				name="username"
				placeholder={SIGNUP_PLACEHOLDER_USERNAMES[Math.floor(Math.random() * SIGNUP_PLACEHOLDER_USERNAMES.length)]}
				type="text"
				error={usernameError}
				defaultValue={username}
				suppressHydrationWarning
			/>
			<TextInput
				label="Email"
				id="email"
				name="email"
				placeholder="you@example.com"
				type="text"
				error={emailError}
				defaultValue={email}
			/>
		</>
	);
}

interface PasswordInputsProps {
	passwordLabel: string;
	passwordError: string;
	confirmPasswordError: string;
}

function PasswordInputs({passwordLabel, passwordError, confirmPasswordError}: PasswordInputsProps) {
	const confirmPasswordLabel = `Confirm ${passwordLabel}`;

	return (
		<>
			<TextInput
				label={passwordLabel}
				id="password"
				name="password"
				placeholder={passwordLabel}
				type="password"
				error={passwordError}
			/>
			<TextInput
				label={confirmPasswordLabel}
				id="confirmPassword"
				name="confirmPassword"
				placeholder={confirmPasswordLabel}
				type="password"
				error={confirmPasswordError}
			/>
		</>
	);
}
