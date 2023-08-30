import React from 'react';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

interface ModalProps {
	open: boolean;
	children: JSX.Element;
}

export default function Modal({open, children}: ModalProps) {
	const containerref = useRef<Element | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const container = document.createElement('div');
		document.querySelector<HTMLElement>('#modal')?.appendChild(container);
		containerref.current = container;
		setMounted(true);
	}, []);

	return (mounted && containerref.current) ? createPortal(
		(
			<>
				<div className={`absolute top-0 left-0 z-50 ${open ? '' : 'hidden'} w-full`}>
					<div className="flex justify-center items-center min-h-screen w-full">
						<div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-md">
							{children}
						</div>
					</div>
				</div>
				<div
					className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-0 ${open ? 'bg-opacity-30' : ''} z-40 ${open ? '' : 'pointer-events-none'}`}
				/>
			</>
		), containerref.current,
	) : null;
}
