export enum LoginTarget {
	Page,
	Popup,
}
export interface LoginPage {
	pageName: string;
	loginTarget: LoginTarget;
}
interface LoginPages {
	[slug: string]: LoginPage;
}

const loginPages: LoginPages = {
	'': {
		pageName: '',
		loginTarget: LoginTarget.Page,
	},
	'chaos': {
		pageName: 'Chaos Game Visualiser',
		loginTarget: LoginTarget.Popup,
	},
}

export default loginPages;
