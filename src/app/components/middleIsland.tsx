export default function MiddleIsland({children}: {children: React.ReactNode}) {
	return (
		<div className="flex justify-center items-center min-h-[var(--real-page-height)]">
			<div className="text-center m-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-md">
					{children}
				</div>
			</div>
		</div>
	);
}
