'use client';

import Button from './../components/button';

import {useState} from 'react';

export default function Buttons() {
	const [buttonLoading, setButtonLoading] = useState(false);

	function authorise() {
		setButtonLoading(true);
	}
	function cancel() {
		window.close();
	}

	return (
		<>
			<Button buttonStyle="success" className="w-full" onClick={authorise} loading={buttonLoading}>Authorise</Button>
			<Button buttonStyle="outline" className="w-full" onClick={cancel}>Cancel</Button>
		</>
	);
}
