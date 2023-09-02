import sanitiseProps from './../utils/sanitise-props';
import Link from './link';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import EyeSlashIcon from '@heroicons/react/24/solid/EyeSlashIcon';
import {useState} from 'react';

import type {DetailedHTMLProps, InputHTMLAttributes} from 'react';

interface TextInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	label: string;
	error?: string;
	labelLink?: InputLabelLink;
}
interface InputLabelLink {
	href: string;
	text: string;
}

export default function TextInput(props: TextInputProps) {
	const [passwordShowing, setPasswordShowing] = useState(false);

	const inputProps = sanitiseProps(props, [
		'label',
		'labelLink',
	]);

	return (
		<div className="text-left">
			<div className="flex">
				<label htmlFor={props.id} className="text-gray-800 dark:text-gray-300 text-md font-bold justify-start">
					{props.label} {props.required && <span className="text-red-500">*</span>}
				</label>
				{props.labelLink && (
					<div className="ml-auto text-sm">
						<Link href={props.labelLink.href}>
							{props.labelLink.text}
						</Link>
					</div>
				)}
			</div>
			<div className="relative">
				{props.type === 'password' && (
					<div className="absolute right-2 top-1/2 -translate-y-[calc(50%-2px)] text-gray-800 w-8 h-8 cursor-pointer select-none" onClick={() => setPasswordShowing(!passwordShowing)}>
						<EyeIcon className={passwordShowing ? '' : 'hidden'}/>
						<EyeSlashIcon className={passwordShowing ? 'hidden' : ''}/>
					</div>
				)}
				<input
					{...inputProps}
					className={`appearance-none shadow border-2 rounded w-full py-2 px-3 text-gray-700 ring-0 focus:outline-none focus:ring-2 mt-2 mb-1 ring-opacity-50 ${props.error ? 'ring-red-400 border-red-500' : 'ring-blue-500'} ${props.type === 'password' ? 'pr-11' : ''}`}
					type={props.type === 'password' ? (passwordShowing ? 'text' : 'password') : props.type}
				/>
			</div>
			{props.error && (
				<span className="text-red-500">
					{props.error}
				</span>
			)}
		</div>
	);
}
