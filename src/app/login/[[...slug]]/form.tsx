'use client';

import Button from './../../components/button';
import {TextInput} from './../../components/input';

import type {FormEvent} from 'react';

export default function LoginForm() {
	return (
		<form className="max-w-lg mx-auto" onSubmitCapture={handleSubmit}>
			<div className="mb-6 mt-8">
				<TextInput
					label="Email"
					id="email"
					name="email"
					placeholder="you@example.com"
					type="email"
					required
					maxLength={256}
					tabIndex={1}
				/>
			</div>
			<div className="mb-8">
				<TextInput
					label="Password"
					labelLink={{href: `/password-reset`, text: 'Forgot password?'}}
					id="password"
					name="password"
					placeholder="Password"
					type="password"
					required
					tabIndex={2}
				/>
			</div>
			<Button type="submit">Log in</Button>
		</form>
	);
}

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
	e.preventDefault();
	console.log(e);
	const form = e.target as HTMLFormElement;
	const formData = new FormData(form);
	const body = Object.fromEntries(formData);
	const response = await fetch('/api/login', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		return;
	}

	const {successful} = await response.json();

	console.log(successful);
}
