import validate from './../../validate';

import type {ValidationData} from './../../validate';

export default function runValidation(validationData: ValidationData, errorFunctions: {[inputName: string]: (error: string) => void}, form: HTMLFormElement | {[key: string]: string} | null): {[key: string]: string} | null {
	if (!form) throw new Error('No form or form data passed for validation');

	Object.values(errorFunctions).forEach((setError) => setError(''));

	const body = getFormEntries(form);
	const validationErrors = validate(validationData, body);
	if (Object.keys(validationErrors).length > 0) {
		Object.entries(validationErrors).forEach(([inputName, error]) => {
			errorFunctions[inputName](error);
		});
		return null;
	}

	return body;
}

function getFormEntries(form: HTMLFormElement | {[key: string]: string}): {[key: string]: string} {
	if (!(form instanceof HTMLFormElement)) return form;

	const formData = new FormData(form);
	return Object.fromEntries(formData) as {[key: string]: string};
}
