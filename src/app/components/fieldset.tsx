export default function Fieldset({children, title}: {children: React.ReactNode, title: string}) {
	return (
		<fieldset className="border border-solid border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-900 dark:bg-opacity-5 rounded p-4 space-y-2">
			<legend className="text-lg text-left font-bold">{title}</legend>
			{children}
		</fieldset>
	);
}
