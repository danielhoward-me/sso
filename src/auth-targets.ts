interface AuthTarget {
	name: string;
	picture: string;
	hostname: string;
	path: string;
	tokenType: 'token';
}

const authTargets: Record<string, AuthTarget> = {
	chaos: {
		name: 'Chaos Game Visualiser',
		picture: 'chaos.jpg',
		hostname: 'chaos.danielhoward.me',
		path: '/auth',
		tokenType: 'token',
	},
};

export default authTargets;
