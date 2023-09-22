interface AuthTarget {
	name: string;
	picture: string;
	hostname: string;
	path: string;
}

const authTargets: Record<string, AuthTarget> = {
	chaos: {
		name: 'Chaos Game Visualiser',
		picture: 'chaos.jpg',
		hostname: 'chaos-backend.danielhoward.me',
		path: '/callback',
	},
};

export default authTargets;
