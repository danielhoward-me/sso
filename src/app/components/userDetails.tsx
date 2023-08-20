'use client';

import {SIGNUP_PLACEHOLDER_USERNAMES} from './../../constants';
import Button from './button';
import {TextInput} from './input';

import {useState} from 'react';

import type User from './../../server/user';

export default function UserDetails({user}: {user: User | null}) {
	const [usernameError, setUsernameError] = useState('');
	const [emailError, setEmailError] = useState('');

	const [currentPasswordError, setCurrentPasswordError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	const [userDetailsButtonLoading, setUserDetailsButtonLoading] = useState(false);
	const [userPasswordButtonLoading, setUserPasswordButtonLoading] = useState(false);
	const [userCreateButtonLoading, setUserCreateButtonLoading] = useState(false);

	function onUserDetailsSubmit() {
		console.log(123);
	}

	function onUserPasswordSubmit() {
		console.log(123);
	}

	const passwordLabel = `${user ? 'New ' : ''}Password`;
	const confirmPasswordLabel = `Confirm ${passwordLabel}`;

	return (
		<div className="space-y-4 mt-6">
			<div className="space-y-3">
				<h1 className="text-3xl font-bold">Account Details</h1>
				<form className="max-w-lg mx-auto space-y-2" onSubmit={onUserDetailsSubmit}>
					<TextInput
						label="Username"
						id="username"
						name="username"
						placeholder={SIGNUP_PLACEHOLDER_USERNAMES[Math.floor(Math.random() * SIGNUP_PLACEHOLDER_USERNAMES.length)]}
						type="text"
						error={usernameError}
						defaultValue={user?.username}
						suppressHydrationWarning
					/>
					<TextInput
						label="Email"
						id="email"
						name="email"
						placeholder="you@example.com"
						type="text"
						error={emailError}
						defaultValue={user?.email}
					/>

					{user && (
						<Button className="mx-auto" type="submit" loading={userDetailsButtonLoading}>
							Save Details
						</Button>
					)}
				</form>
			</div>

			<div className="space-y-3">
				<h1 className="text-3xl font-bold">Password</h1>
				<form className="max-w-lg mx-auto space-y-2" onSubmit={onUserPasswordSubmit}>
					{user && (
						<TextInput
							label="Current Password"
							id="currentPassword"
							name="currentPassword"
							placeholder="Password"
							type="password"
							error={currentPasswordError}
						/>
					)}

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

					{user && (
						<Button className="mx-auto" type="submit" loading={userPasswordButtonLoading}>
							Update Password
						</Button>
					)}
				</form>
			</div>

			{!user && (
				<Button className="mx-auto" type="submit" loading={userCreateButtonLoading}>
					Create Account
				</Button>
			)}
		</div>
	);
}
