export enum LoginLocation {
	Page,
	Popup,
}

export default class LoginPage {
	slug: string;
	name: string;
	loginLocation: LoginLocation;

	constructor(slug: string, name: string, loginLocation: LoginLocation) {
		this.slug = slug;
		this.name = name;
		this.loginLocation = loginLocation;
	}

	public onSuccessfulLogin(): void {
		throw new Error('Not implemented');
	}
}
