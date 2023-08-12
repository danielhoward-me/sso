import LoginPage, {LoginLocation} from './loginPage';

import {redirect} from 'next/navigation';

export default class BasePage extends LoginPage {
	constructor() {
		super('', 'Your Account', LoginLocation.Page);
	}

	onSuccessfulLogin() {
		redirect('/');
	}
}
