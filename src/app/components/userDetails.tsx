'use client';

import {SIGNUP_PLACEHOLDER_USERNAMES} from './../../constants';
import {signupPageValidationData} from './../../inputs';
import validate from './../../validate';
import Button from './button';
import {TextInput} from './input';

import {useRef, useState} from 'react';

import type {ValidationData} from './../../validate';
import type {SignupApiResponse} from './../types.d';
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
	const [userPasswordButtonLoading, setUserPasswordButtonLoading] = useState(false);
	const [userCreateButtonLoading, setUserCreateButtonLoading] = useState(false);

	const [userDetailsErrorText, setUserDetailsErrorText] = useState('');
	const [userPasswordErrorText, setUserPasswordErrorText] = useState('');
	const [userCreateErrorText, setUserCreateErrorText] = useState('');

	const userDetailsFormRef = useRef<HTMLFormElement>(null);
	const userPasswordFormRef = useRef<HTMLFormElement>(null);
	const userCreateFormRef = useRef<HTMLFormElement>(null);

	function resetErrors() {
		setUsernameError('');
		setEmailError('');
		setCurrentPasswordError('');
		setPasswordError('');
		setConfirmPasswordError('');

		setUserDetailsErrorText('');
		setUserPasswordErrorText('');
		setUserCreateErrorText('');
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
	}

	async function onUserPasswordSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		resetErrors();
		setUserPasswordButtonLoading(true);
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
			const createUserOutcome = await createUser(validData);
			if (createUserOutcome.accountCreated) {
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
					<>
						<form className="max-w-lg mx-auto space-y-2" onSubmit={onUserDetailsSubmit} ref={userDetailsFormRef}>
							<h1 className="text-3xl font-bold">Account Details</h1>
							<UserDetailsInputs username={user.username} email={user.email} usernameError={usernameError} emailError={emailError}/>

							{userDetailsErrorText && <p className="text-red-500 text-center mt-4">{userDetailsErrorText}</p>}

							<Button className="mx-auto !mt-4" type="submit" loading={userDetailsButtonLoading}>
								Save Details
							</Button>
						</form>
						<form className="max-w-lg mx-auto space-y-2" onSubmit={onUserPasswordSubmit} ref={userPasswordFormRef}>
							<h1 className="text-3xl font-bold">Password</h1>
							<TextInput
								label="Current Password"
								id="currentPassword"
								name="currentPassword"
								placeholder="Password"
								type="password"
								error={currentPasswordError}
							/>
							<PasswordInputs passwordLabel={passwordLabel} passwordError={passwordError} confirmPasswordError={confirmPasswordError}/>

							{userPasswordErrorText && <p className="text-red-500 text-center mt-4">{userPasswordErrorText}</p>}

							<Button className="mx-auto !mt-4" type="submit" loading={userPasswordButtonLoading}>
								Update Password
							</Button>
						</form>
					</>
				) : (
					<form className="max-w-lg mx-auto space-y-2" onSubmit={onUserCreateSubmit} ref={userCreateFormRef}>
						<h1 className="text-3xl font-bold">Account Details</h1>
						<UserDetailsInputs usernameError={usernameError} emailError={emailError}/>

						<h1 className="text-3xl font-bold !mt-4">Password</h1>
						<PasswordInputs passwordLabel={passwordLabel} passwordError={passwordError} confirmPasswordError={confirmPasswordError}/>

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

async function createUser(body: {[key: string]: string}): Promise<SignupApiResponse> {
	const response = await fetch('/api/signup', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to make request to api signup route');
	}

	return await response.json();
}
