import {changeModalContent, changeModalOpen} from './../modal-handler';

interface ModalProps {
	open: boolean;
	children: JSX.Element;
}

export default function Modal({open, children}: ModalProps) {
	changeModalContent(children);
	changeModalOpen(open);
	return null;
}
