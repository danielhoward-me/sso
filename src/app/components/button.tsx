import sanitiseProps from './../utils/sanitise-props';
import LoadingSpinner from './loading-spinner';

import type {DetailedHTMLProps, ButtonHTMLAttributes} from 'react';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	loading?: boolean;
	buttonStyle?: 'primary' | 'success' | 'danger' | 'outline';
}

export default function Button(props: ButtonProps) {
	const buttonProps = sanitiseProps(props, [
		'loading',
		'buttonStyle',
	]);

	const style = props.buttonStyle || 'primary';

	return (
		<button
			{...buttonProps}
			className={[
				props.className ? props.className : '',
				'flex items-center justify-center font-bold py-2 px-4 rounded ring-0',
				style === 'primary' ? 'bg-blue-600' : '',
				style === 'success' ? 'bg-green-600' : '',
				style === 'danger' ? 'bg-red-500' : '',
				style === 'outline' ? 'outline outline-gray-500 dark:outline-gray-300 outline-1' : 'text-white',
				props.disabled || props.loading ? 'cursor-not-allowed opacity-50' : ([
					style === 'primary' ? 'hover:bg-blue-800 focus:ring-blue-600' : '',
					style === 'success' ? 'hover:bg-green-700 focus:ring-green-600' : '',
					style === 'danger' ? 'hover:bg-red-700 focus:ring-red-500' : '',
					style === 'outline' ? 'hover:bg-gray-100 dark:hover:bg-gray-900 focus:ring-0 focus:outline-2' : 'focus:outline-none focus:ring-2',
				].join(' '))].join(' ')}
			disabled={props.disabled || props.loading}
		>
			<LoadingSpinner visible={props.loading === true}/>
			{props.children}
		</button>
	);
}
