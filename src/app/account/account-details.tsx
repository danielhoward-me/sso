'use client';

import {userDetailsValidationData, changePasswordValidationData} from './../../inputs';
import {UserDetailsInputs, PasswordInputs} from './../components/account-inputs';
import Button from './../components/button';
import Fieldset from './../components/fieldset';
import TextInput from './../components/input';
import MiddleIsland from './../components/middle-island';
import Modal from './../components/modal';
import {changeUsername} from './../navbar-elements';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import Image from 'next/image';
import {useState, useRef} from 'react';

import type {AccountDetailsApiResponse, BasicApiResponse} from './../types.d';
import type {UserDetailsValues} from './../utils/get-user-detailsValues';
import type {FormEvent} from 'react';

export default function AccountDetails({user}: {user: UserDetailsValues}) {
	const [profilePictureMenuOpen, setProfilePictureMenuOpen] = useState(false);

	const [usernameError, setUsernameError] = useState('');
	const [emailError, setEmailError] = useState('');

	const [currentPasswordError, setCurrentPasswordError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	const [userDetailsButtonLoading, setUserDetailsButtonLoading] = useState(false);
	const [changePasswordButtonLoading, setChangePasswordButtonLoading] = useState(false);

	const [userDetailsErrorText, setUserDetailsErrorText] = useState('');
	const [changePasswordErrorText, setChangePasswordErrorText] = useState('');

	const [userDetailsSuccessText, setUserDetailsSuccessText] = useState('');
	const [changePasswordSuccessText, setChangePasswordSuccessText] = useState('');

	const userDetailsFormRef = useRef<HTMLFormElement>(null);
	const changePasswordFormRef = useRef<HTMLFormElement>(null);

	async function onUserDetailsSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setUserDetailsButtonLoading(true);
		setUserDetailsSuccessText('');
		setUserDetailsErrorText('');

		const validData = runValidation(userDetailsValidationData, {
			username: setUsernameError,
			email: setEmailError,
		}, userDetailsFormRef.current);
		if (validData === null) {
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

		setChangePasswordButtonLoading(true);
		setChangePasswordSuccessText('');
		setChangePasswordErrorText('');

		const validData = runValidation(changePasswordValidationData, {
			currentPassword: setCurrentPasswordError,
			password: setPasswordError,
			confirmPassword: setConfirmPasswordError,
		}, changePasswordFormRef.current);
		if (validData === null) {
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

	return (
		<>
			<MiddleIsland fullWidth>
				<h1 className="text-6xl font-bold pb-2">View Your Account</h1>
				<div className="space-y-1 mt-6">
					<div className="max-w-4xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-[auto_301px] space-y-1 lg:space-x-4 lg:space-y-0">
							<Fieldset title="Account Details">
								<form className="space-y-2" onSubmit={onUserDetailsSubmit} ref={userDetailsFormRef}>
									<UserDetailsInputs username={user.username} email={user.email} usernameError={usernameError} emailError={emailError}/>

									{userDetailsErrorText && <p className="text-red-500 text-center mt-4">{userDetailsErrorText}</p>}
									{userDetailsSuccessText && <p className="text-green-600 text-center mt-4">{userDetailsSuccessText}</p>}

									<Button className="mx-auto !mt-4" type="submit" loading={userDetailsButtonLoading}>
									Save Details
									</Button>
								</form>
							</Fieldset>
							<Fieldset title="Profile Picture">
								<div className="flex justify-center items-center p-5 relative">
									<div className="rounded-full cursor-pointer group" onClick={() => setProfilePictureMenuOpen(true)}>
										<Image
											src={`${user.profilePicture}&s=200`}
											alt="Account Profile Picture"
											width={200}
											height={200}
											className="transition-[filter] group-hover:brightness-50 rounded-full"
											draggable={false}
										/>
										<span className="text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 select-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
										Change Profile Picture
										</span>
									</div>
								</div>
								<Modal open={profilePictureMenuOpen}>
									<div className="flex items-center">
										test
									</div>
								</Modal>
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
								error={currentPasswordError}
								type="password"
							/>
							<PasswordInputs labelPrefix="New " passwordError={passwordError} confirmPasswordError={confirmPasswordError}/>

							{changePasswordErrorText && <p className="text-red-500 text-center mt-4">{changePasswordErrorText}</p>}
							{changePasswordSuccessText && <p className="text-green-600 text-center mt-4">{changePasswordSuccessText}</p>}

							<Button className="mx-auto !mt-4" type="submit" loading={changePasswordButtonLoading}>
							Update Password
							</Button>
						</Fieldset>
					</form>
				</div>
			</MiddleIsland>
		</>
	);
}
