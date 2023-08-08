import BasePage from './base';
import ChaosGamePage from './chaos-game';

import type LoginPage from './loginPage';

const pages = [
	new BasePage(),
	new ChaosGamePage(),
];
const pageMap: {
	[key: string]: LoginPage
} = {};
pages.forEach((page) => {
	pageMap[page.slug] = page;
});
export default pageMap;
