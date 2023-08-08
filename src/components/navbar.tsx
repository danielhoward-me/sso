import Image from 'next/image';
import Router from 'next/router';

export default function NavBar() {
	return (
		<nav className="flex w-full bg-white dark:bg-gray-900 shadow p-2 dark:text-white">
			<div>
				<button
					type="button"
					onClick={() => Router.push('/')}
					title="Home"
					aria-label="Home page"
					className="flex gap-4 items-center"
				>
					<Image
						src="static/img/icon.svg"
						alt="Accounts icon"
						width={32} height={32}
						className="dark:filter dark:invert"
					/>
					Account
				</button>
			</div>
		</nav>
	);
}
