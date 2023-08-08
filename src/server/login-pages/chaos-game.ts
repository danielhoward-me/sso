import LoginPage, {LoginLocation} from './loginPage';

export default class ChaosGamePage extends LoginPage {
	constructor() {
		super('chaos', 'Chaos Game Visualiser', LoginLocation.Popup);
	}
}
