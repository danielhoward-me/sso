import type {ReactNode} from 'react';

export default function MiddleIsland({fullWidth, children}: {fullWidth?: boolean, children: ReactNode}) {
	return (
		<div className="flex justify-center items-center min-h-[var(--real-page-height)]">
			<div className={`text-center m-4 ${fullWidth && 'w-[80rem]'}`}>
				<div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-md">
					{children}
				</div>
			</div>
		</div>
	);
}
