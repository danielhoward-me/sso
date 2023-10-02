'use client';

import {confirmEmailValidationData} from './../../inputs';
import Button from './../components/button';
import TextInput from './../components/input';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import {useEffect, useRef, useState} from 'react';

import type {BasicApiResponse} from './../types.d';
import type {ChangeEvent, FormEvent, RefObject} from 'react';

export default function ConfirmEmailForm({email, redirect}: {email: string, redirect: string}) {
	const [continueButtonLoading, setContinueButtonLoading] = useState(false);
	const [cancelButtonLoading, setCancelButtonLoading] = useState(false);

	const [errorText, setErrorText] = useState('');

	const codeInputs = new Array(6).fill(null).map(() => useRef<HTMLInputElement>(null));
	const codeValues = new Array(6).fill(null).map(() => useState(''));

	useEffect(() => {
		codeInputs.forEach(({current: input}) => {
			input?.addEventListener('paste', (ev) => {
				const value = ev.clipboardData?.getData('text');
				if (!value || !/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(value)) return;
				ev.preventDefault();

				value.replace('-', '').split('').forEach((char, charI) => {
					codeValues[charI][1](char);
				});

				codeInputs[5].current?.focus();
			});
		});
	});

	// Run once on page load
	useEffect(() => {
		codeInputs[0].current?.focus();
	}, []);

	// Run whenever a code value is updated
	useEffect(() => {
		const authCode = getAuthCode();
		if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(authCode)) return;

		submitCode();
	}, codeValues.map(([value]) => value));

	function onInputChange(i: number) {
		return (ev: ChangeEvent<HTMLInputElement>) => {
			ev.preventDefault();
			const newValue = ev.target.value;

			const characer = newValue.substring(0, 1).toUpperCase();
			if (characer !== '' && !/^[A-Z0-9]$/.test(characer)) return;

			codeValues[i][1](characer);

			if (characer === '') return;

			if (i !== 5) codeInputs[i + 1].current?.focus();
		};
	}

	async function submitCode(ev?: FormEvent<HTMLFormElement>) {
		ev?.preventDefault();

		setContinueButtonLoading(true);

		const authCode = getAuthCode();

		const validData = runValidation(confirmEmailValidationData, {authCode: setErrorText}, {authCode});
		if (validData === null) {
			setContinueButtonLoading(false);
			return;
		}

		try {
			const {successful} = await makeApiRequest<BasicApiResponse>('confirm-email', validData);
			if (successful) {
				window.location.href = redirect;
				return;
			} else {
				setErrorText('The code entered is incorrect.');
			}
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when checking your code. Please try again later.');
		}

		setContinueButtonLoading(false);
	}

	function getAuthCode(): string {
		let code = '';

		codeValues.forEach(([value]) => code += value);
		code = `${code.substring(0, 3)}-${code.substring(3, 6)}`;

		return code;
	}

	function cancel() {
		setCancelButtonLoading(true);
		window.location.href = '/logout';
	}

	return (
		<form onSubmit={submitCode}>
			<div className="flex flex-col gap-2">
				<div className="text-md">
					An email has been sent to <i>{email}</i> with a code. Please enter that code below.
				</div>
				<b>
					<div className="flex items-center justify-center gap-2">
						<CodeInput key={0} placeholder="0" inputRef={codeInputs[0]} value={codeValues[0][0]} onChange={onInputChange(0)}/>
						<CodeInput key={1} placeholder="0" inputRef={codeInputs[1]} value={codeValues[1][0]} onChange={onInputChange(1)}/>
						<CodeInput key={2} placeholder="0" inputRef={codeInputs[2]} value={codeValues[2][0]} onChange={onInputChange(2)}/>
						<div className="font-normal">—</div>
						<CodeInput key={3} placeholder="A" inputRef={codeInputs[3]} value={codeValues[3][0]} onChange={onInputChange(3)}/>
						<CodeInput key={4} placeholder="A" inputRef={codeInputs[4]} value={codeValues[4][0]} onChange={onInputChange(4)}/>
						<CodeInput key={5} placeholder="A" inputRef={codeInputs[5]} value={codeValues[5][0]} onChange={onInputChange(5)}/>
					</div>
				</b>
				{errorText && <p className="text-red-500 text-center mb-1">{errorText}</p>}
				<div className="flex items-center justify-center gap-2">
					<Button buttonStyle="success" type="submit" loading={continueButtonLoading}>Continue</Button>
					<Button buttonStyle="outline" onClick={cancel} loading={cancelButtonLoading}>Cancel</Button>
				</div>
			</div>
		</form>
	);
}

function CodeInput({placeholder, inputRef, value, onChange}: {placeholder: string, inputRef: RefObject<HTMLInputElement>, value: string, onChange: (ev: ChangeEvent<HTMLInputElement>) => void}) {
	return (
		<TextInput singleCharInput placeholder={placeholder} ref={inputRef} value={value} onChange={onChange}/>
	);
}
