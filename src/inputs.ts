import type {ValidationData, ValidationDataInputs, StringValidationPattern} from './validate';

const emailValidationPattern: StringValidationPattern = {
	pattern: /^[^@]+@[^@]+\.[^@]+$/,
	message: 'must be a valid email address',
};

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
			patterns: [emailValidationPattern],
		},
		password: {
			type: 'string',
			required: true,
		},
	},
	capitalise: true,
};

const userDetailsValidationInputs: ValidationDataInputs = {
	username: {
		type: 'string',
		required: true,
		patterns: [
			{
				pattern: /\S/,
				message: 'must not contain any spaces',
			},
		],
	},
	email: {
		type: 'string',
		required: true,
		maxLength: 256,
		patterns: [emailValidationPattern],
	},
};
const passwordValidationInputs: ValidationDataInputs = {
	password: {
		type: 'string',
		required: true,
		minLength: 8,
		patterns: [
			{
				pattern: /[a-z]/,
				message: 'must contain at least one lowercase letter',
			},
			{
				pattern: /[A-Z]/,
				message: 'must contain at least one uppercase letter',
			},
			{
				pattern: /[0-9]/,
				message: 'must contain at least one number',
			},
			{
				pattern: /[^a-zA-Z0-9]/,
				message: 'must contain something other than a letter or number',
			},
		],
	},
	confirmPassword: {
		type: 'string',
		required: true,
		shouldMatch: ['password'],
	},
};
export const signupPageValidationData: ValidationData = {
	inputs: {
		...userDetailsValidationInputs,
		...passwordValidationInputs,
	},
	capitalise: true,
};
export const userDetailsValidationData: ValidationData = {
	inputs: userDetailsValidationInputs,
	capitalise: true,
};
export const changePasswordValidationData: ValidationData = {
	inputs: {
		...passwordValidationInputs,
		currentPassword: {
			type: 'string',
			required: true,
		},
	},
	capitalise: true,
};

interface ValidationDataMapEntry {
	validationData: ValidationData;
	requiresAccount: boolean;
}
export const apiValidationDataMap: {[key: string]: ValidationDataMapEntry} = {
	// Session api has its own authentication
	login: {
		validationData: loginPageValidationData,
		requiresAccount: false,
	},
	signup: {
		validationData: signupPageValidationData,
		requiresAccount: false,
	},
	edituserdetails: {
		validationData: userDetailsValidationData,
		requiresAccount: true,
	},
	changepassword: {
		validationData: changePasswordValidationData,
		requiresAccount: true,
	},
};
