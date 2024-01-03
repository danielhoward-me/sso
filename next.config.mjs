/** @type {import('next').NextConfig} */
export default {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'www.gravatar.com',
				port: '',
				pathname: '/avatar/**',
			},
		],
	},
	output: 'standalone',
};
