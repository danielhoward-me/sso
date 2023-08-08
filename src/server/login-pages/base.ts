import LoginPage, {LoginLocation} from './loginPage';

export default class BasePage extends LoginPage {
	constructor() {
		super('', '', LoginLocation.Page);
	}
}
