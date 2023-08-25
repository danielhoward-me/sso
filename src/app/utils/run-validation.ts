import validate from './../../validate';

import type {ValidationData} from './../../validate';

export default function runValidation(validationData: ValidationData, errorFunctions: {[inputName: string]: (error: string) => void}, form: HTMLFormElement | null): {[key: string]: string} | null {
	if (!form) throw new Error('No form passed for validation');

	Object.values(errorFunctions).forEach((setError) => setError(''));

	const formData = new FormData(form);
	const body = Object.fromEntries(formData) as {[key: string]: string};

	const validationErrors = validate(validationData, body);
	if (Object.keys(validationErrors).length > 0) {
		Object.entries(validationErrors).forEach(([inputName, error]) => {
			errorFunctions[inputName](error);
		});
		return null;
	}

	return body;
}
