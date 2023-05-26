import type {LoginTarget} from './constants';

export interface LoginPages {
	[slug: string]: LoginPage;
}
export interface LoginPage {
	pageName: string;
	loginTarget: LoginTarget;
}

export interface LoginPageData {
	slug: string;
	page_name: string;
	login_target: string;
}
