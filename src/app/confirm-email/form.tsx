'use client';

import TextInput from './../components/input';

export default function ConfirmEmailForm({email}: {email: string}) {
	return (
		<div>
			<div className="text-md">
				An email has been sent to <i>{email}</i> with a code. Please enter that code below.
			</div>
			<div className="flex items-center justify-center">
				<CodeInput/>
				<CodeInput/>
				<CodeInput/>
				<div className="px-1">—</div>
				<CodeInput/>
				<CodeInput/>
				<CodeInput/>
			</div>
		</div>
	);
}

function CodeInput() {
	return (
		<div className="w-10 px-2"><TextInput/></div>
	);
}
