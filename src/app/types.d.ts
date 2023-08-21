export interface SearchParamsProps {
	searchParams: {
		[key: string]: string | string[] | undefined,
	};
}

export type SignupApiResponse = {
	accountCreated: true;
} | {
	accountCreated: false;
	usernameExists?: boolean;
	emailExists?: boolean;
};
