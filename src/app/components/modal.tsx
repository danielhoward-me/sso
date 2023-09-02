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
		const allModalsContainer = document.querySelector<HTMLElement>('#modal');
		if (!allModalsContainer) throw new Error('No modal container found');

		const container = document.createElement('div');
		container.style.setProperty('--modal-z-index', (50 + allModalsContainer.children.length * 10).toString());
		allModalsContainer.appendChild(container);
		containerref.current = container;
		setMounted(true);
	}, []);

	return (mounted && containerref.current) ? createPortal(
		(
			<>
				<div className={`fixed top-0 bottom-0 left-0 right-0 z-[calc(var(--modal-z-index)+1)] ${open ? 'body-overflow-hide' : 'hidden'} w-full overflow-y-auto`}>
					<div className="flex justify-center items-center min-h-screen w-full">
						<div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-md m-4">
							{children}
						</div>
					</div>
				</div>
				<div
					className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-0 z-[var(--modal-z-index)] ${open ? 'bg-opacity-30' : 'pointer-events-none'}`}
				/>
			</>
		), containerref.current,
	) : null;
}
