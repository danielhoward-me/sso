export interface SearchParamsProps {
	searchParams: {
		[key: string]: string | string[] | undefined,
	};
}

export type BasicApiResponse<S = object, U = object> = (
	{
		successful: true;
	} & S
) | (
	{
		successful: false;
	} & U
);

export type AccountDetailsApiResponse = BasicApiResponse<{
	userId: string;
}, {
	usernameExists: boolean;
	emailExists: boolean;
}>;

export type AuthApiResponse = {
	redirect: string;
};
