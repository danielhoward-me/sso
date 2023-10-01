export interface SearchParamsProps {
	searchParams: {
		[key: string]: string | string[] | undefined,
	};
}

export type BasicApiResponse<T = object> = (
	{
		successful: true;
	}
) | (
	{
		successful: false;
	} & T
);

export type AccountDetailsApiResponse = BasicApiResponse<{
	usernameExists: boolean;
	emailExists: boolean;
}>;

export type LoginApiResponse = BasicApiResponse<{
	requiresEmailAuth?: boolean;
}>;

export type AuthApiResponse = {
	redirect: string;
};
