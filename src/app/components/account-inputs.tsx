import {SIGNUP_PLACEHOLDER_USERNAMES} from './../../constants';
import TextInput from './input';

interface UserDetailsInputsProps {
	username?: string;
	email?: string;
	usernameError: string;
	emailError: string;
}

export function UserDetailsInputs({username, email, usernameError, emailError}: UserDetailsInputsProps) {
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
	labelPrefix?: string;
	passwordError: string;
	confirmPasswordError: string;
}

export function PasswordInputs({labelPrefix, passwordError, confirmPasswordError}: PasswordInputsProps) {
	const label = `${labelPrefix || ''}Password`;
	const confirmLabel = `Confirm ${label}`;

	return (
		<>
			<TextInput
				label={label}
				id="password"
				name="password"
				placeholder={label}
				error={passwordError}
				type="password"
			/>
			<TextInput
				label={confirmLabel}
				id="confirmPassword"
				name="confirmPassword"
				placeholder={confirmLabel}
				error={confirmPasswordError}
				type="password"
			/>
		</>
	);
}
