import NavBar from './navbar';

import type {Session} from './../constants/session';

interface Props {
	children: React.ReactNode;
	session: Session;
}

export default function Layout({children, session}: Props) {
	return (
		<div>
			<NavBar session={session}/>
			<main>
				{children}
			</main>
		</div>
	);
}
