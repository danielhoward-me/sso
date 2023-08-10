import './../styles/globals.css';

import Layout from './../components/layout';

import type {Session} from './../constants/session';
import type {AppProps} from 'next/app';

interface Props {
	session: Session;
}

export default function App({Component, pageProps}: AppProps<Props>) {
	const session = pageProps.session;

	return (
		<Layout session={session}>
			<Component {...pageProps}/>
		</Layout>
	);
}
