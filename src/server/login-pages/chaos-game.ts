import LoginPage, {LoginLocation} from './loginPage';

import {redirect} from 'next/navigation';

export default class ChaosGamePage extends LoginPage {
	constructor() {
		super('chaos', 'Chaos Game Visualiser', LoginLocation.Popup);
	}

	onSuccessfulLogin() {
		redirect('https://chaos.danielhoward.me');
	}
}
