// import {DEFAULT_POST_LOGIN_REDIRECT} from './../../constants';
// import {getSession} from './../../server/session';
// import Link from './../components/link';
// import LoginForm from './form';

// import {headers} from 'next/headers';
// import {redirect} from 'next/navigation';

// import type {Metadata} from 'next';

// export const metadata: Metadata = {
// 	title: 'Create an Account',
// 	description: 'Create an account to save your data across all of my services',
// };

// interface Props {
// 	searchParams: {
// 		[key: string]: string | string[] | undefined,
// 	};
// }

// export default function LoginPage({searchParams}: Props) {
// 	const session = getSession();


// 	if (session.user) {
// 		redirect(redirectParam);
// 	}

// 	return (
// 		<div className="flex justify-center items-center min-h-[var(--real-page-height)]">
// 			<div className="text-center m-4">
// 				<div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-md">
// 					<h1 className="text-6xl font-bold pb-2">Log in to Your Account</h1>
// 					<LoginForm redirect={redirectParam}/>
// 					<div className="block mt-5 leading-snug">
// 						Don't have an account?
// 						<br/>
// 						<Link href="/signup">
// 							Create one here
// 						</Link>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
