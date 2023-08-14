import type {ValidationData} from './validate';

export const sessionApiValidationData: ValidationData = {
	inputs: {
		sessionId: {
			type: 'string',
			required: false,
		},
		ip: {
			type: 'string',
			required: true,
		},
	},
};

export const loginPageValidationData: ValidationData = {
	inputs: {
		email: {
			type: 'string',
			required: true,
			maxLength: 256,
			patterns: [
				{
					pattern: /^[^@]+@[^@]+\.[^@]+$/,
					message: 'must be a valid email address',
				},
			],
		},
		password: {
			type: 'string',
			required: true,
		},
	},
	capitalise: true,
};
