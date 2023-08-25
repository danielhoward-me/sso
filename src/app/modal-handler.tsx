'use client';

import {useState} from 'react';

export let changeModalContent: (content: JSX.Element) => void;
export let changeModalOpen: (open: boolean) => void;

export default function ModalHandler() {
	const [modalContent, setModalContent] = useState(<></>);
	const [open, setOpen] = useState(false);
	changeModalContent = setModalContent;
	changeModalOpen = setOpen;

	return (
		<>
			<div className={`absolute top-0 left-0 z-50 ${open ? '' : 'hidden'} w-full`}>
				<div className="flex justify-center items-center min-h-screen w-full">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-md">
						{modalContent}
					</div>
				</div>
			</div>
			<div
				className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-0 ${open ? 'bg-opacity-30' : ''} z-40 ${open ? '' : 'pointer-events-none'}`}
			/>
		</>
	);
}
