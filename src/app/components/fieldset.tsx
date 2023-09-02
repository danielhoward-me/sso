export default function Fieldset({title, children}: {title: string, children: React.ReactNode}) {
	return (
		<fieldset className="border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-opacity-5 rounded p-4 space-y-2">
			<legend className="text-lg text-left font-bold">{title}</legend>
			{children}
		</fieldset>
	);
}
