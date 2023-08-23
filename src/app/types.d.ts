export interface SearchParamsProps {
	searchParams: {
		[key: string]: string | string[] | undefined,
	};
}

export interface LoginApiResponse {
	successful: boolean;
}

export type SignupApiResponse = {
	accountCreated: true;
} | {
	accountCreated: false;
	usernameExists?: boolean;
	emailExists?: boolean;
};

export type EditUserDetailsApiResponse = {
	detailsChanged: true;
} | {
	detailsChanged: false;
	usernameExists?: boolean;
	emailExists?: boolean;
};
