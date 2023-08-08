import NavBar from './navbar';

interface Props {
	children: React.ReactNode;
}

export default function Layout({children}: Props) {
	return (
		<>
			<NavBar/>
			<main>
				{children}
			</main>
		</>
	);
}
