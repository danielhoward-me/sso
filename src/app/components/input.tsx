import Link from './link';

type TextInputProps = {
	label: string;
	error?: string;
	labelLink?: InputLabelLink;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
interface InputLabelLink {
	href: string;
	text: string;
}

export function TextInput(props: TextInputProps) {
	const nonInputAttributes = [
		'label',
		'labelLink',
	];
	const inputProps = {};
	Object.keys(props).forEach((attribute) => {
		if (nonInputAttributes.includes(attribute)) return;
		inputProps[attribute] = props[attribute];
	});

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
			<input
				className={`appearance-none shadow border-2 rounded w-full py-2 px-3 text-gray-700 ring-0 focus:outline-none focus:ring-2 mt-2 mb-1 ring-opacity-50 ${props.error ? 'ring-red-400 border-red-500' : 'ring-blue-500'}`}
				{...inputProps}
				// required should be handled by the validate function
				required={false}
			/>
			{props.error && (
				<span className="text-red-500">
					{props.error}
				</span>
			)}
		</div>
	);
}
