'use client';

import TextInput from './../components/input';

import {useEffect, useRef, useState} from 'react';

import type {ChangeEvent, RefObject} from 'react';

export default function ConfirmEmailForm({email}: {email: string}) {
	const codeInputs = new Array(6).fill(null).map(() => useRef<HTMLInputElement>(null));
	const codeValues = new Array(6).fill(null).map(() => useState(''));

	useEffect(() => {
		codeInputs.forEach(({current: input}) => {
			input?.addEventListener('paste', (ev) => {
				const value = ev.clipboardData?.getData('text');
			});
		});
	});

	function onInputChange(i: number) {
		return (ev: ChangeEvent<HTMLInputElement>) => {
			ev.preventDefault();
			const newValue = ev.target.value;
			console.log(newValue);

			const characer = newValue.substring(0, 1).toUpperCase();
			codeValues[i][1](characer);

			if (newValue === '') return;

			if (i === 5) {
				//
			} else {
				codeInputs[i + 1].current?.focus();
			}
		};
	}

	return (
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
					<CodeInput key={3} placeholder="0" inputRef={codeInputs[3]} value={codeValues[3][0]} onChange={onInputChange(3)}/>
					<CodeInput key={4} placeholder="0" inputRef={codeInputs[4]} value={codeValues[4][0]} onChange={onInputChange(4)}/>
					<CodeInput key={5} placeholder="0" inputRef={codeInputs[5]} value={codeValues[5][0]} onChange={onInputChange(5)}/>
				</div>
			</b>
		</div>
	);
}

function CodeInput({placeholder, inputRef, value, onChange}: {placeholder: string, inputRef: RefObject<HTMLInputElement>, value: string, onChange: (ev: ChangeEvent<HTMLInputElement>) => void}) {
	return (
		<TextInput singleCharInput placeholder={placeholder} ref={inputRef} value={value} onChange={onChange}/>
	);
}
