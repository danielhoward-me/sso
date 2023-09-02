import sanitiseProps from './../utils/sanitise-props';
import LoadingSpinner from './loading-spinner';

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	loading?: boolean;
	buttonStyle?: 'primary' | 'danger';
}

export default function Button(props: ButtonProps) {
	const buttonProps = sanitiseProps(props, [
		'loading',
		'buttonStyle',
	]);

	const isPrimary = (props.buttonStyle || 'primary') === 'primary';

	return (
		<button
			{...buttonProps}
			className={`${props.className ? props.className : ''} ${isPrimary ? 'bg-blue-600' : 'bg-red-500'} text-white flex items-center font-bold py-2 px-4 rounded ring-0 ${props.disabled || props.loading ? 'cursor-not-allowed opacity-50' : `${isPrimary ? 'hover:bg-blue-800' : 'hover:bg-red-700'} focus:outline-none focus:ring-2 ${isPrimary ? 'focus:ring-blue-600' : 'focus:ring-red-500'}`}`}
			disabled={props.disabled || props.loading}
		>
			<LoadingSpinner visible={props.loading === true}/>
			{props.children}
		</button>
	);
}
