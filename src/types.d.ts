export interface LoginPages {
	[slug: string]: LoginPage;
}
export interface LoginPage {
	pageName: string;
	loginTarget: LoginSource;
}
export enum LoginSource {
	Window,
}
