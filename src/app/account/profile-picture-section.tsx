import {ProfilePictureType} from './../../constants';
import {profilePictureValidationData} from './../../inputs';
import constructProfilePicture from './../../server/construct-profile-picture';
import Button from './../components/button';
import Link from './../components/link';
import Modal from './../components/modal';
import {changeProfilePictureUrl} from './../navbar-elements';
import makeApiRequest from './../utils/make-api-request';
import runValidation from './../utils/run-validation';

import Image from 'next/image';
import {useState} from 'react';

interface Props {
	type: ProfilePictureType;
	emailHash: string;
}

export let updateProfilePicutre: (emailHash?: string) => void;

export default function ProfilePictureSection({type, emailHash: initEmailHash}: Props) {
	const [emailHash, setEmailHash] = useState(initEmailHash);

	const [menuOpen, setMenuOpen] = useState(false);

	const [buttonLoading, setButtonLoading] = useState(false);

	const [errorText, setErrorText] = useState('');

	const [profilePictureSelected, setProfilePictureSelected] = useState(type);
	const [originalProfilePictureType, setOriginalProfilePictureType] = useState(type);

	const [profilePictureUrl, setProfilePictureUrl] = useState(constructProfilePicture(type, emailHash));

	const [hasCustomProfilePictrue, setHasCustomProfilePictrue] = useState(true);

	updateProfilePicutre = (newEmailHash?: string) => {
		setHasCustomProfilePictrue(true);
		if (newEmailHash && emailHash !== newEmailHash) setEmailHash(newEmailHash);
		const url = constructProfilePicture(profilePictureSelected, newEmailHash || emailHash);
		setProfilePictureUrl(url);
		changeProfilePictureUrl(url);
	};

	function openMenu() {
		setOriginalProfilePictureType(profilePictureSelected);
		setMenuOpen(true);
	}

	async function save() {
		setButtonLoading(true);
		setErrorText('');

		const validData = runValidation(profilePictureValidationData, {
			profilePicture: setErrorText,
		}, {
			profilePicture: profilePictureSelected,
		});
		if (validData === null) {
			setButtonLoading(false);
			return;
		}

		try {
			await makeApiRequest('user/profile-picture', validData);
			updateProfilePicutre();
			setMenuOpen(false);
		} catch (err) {
			console.error(err);
			setErrorText('There was an error when attempting to change your profile picture. Please try again later.');
		}

		setButtonLoading(false);
	}

	function cancel() {
		setProfilePictureSelected(originalProfilePictureType);
		setMenuOpen(false);
	}

	return (
		<>
			<div className="p-5">
				<div className="flex justify-center items-center relative">
					<div className="rounded-full cursor-pointer group" onClick={openMenu}>
						<Image
							src={`${profilePictureUrl}&s=200`}
							alt="Account Profile Picture"
							width={200}
							height={200}
							className="transition-[filter] group-hover:brightness-50 rounded-full"
							draggable={false}
						/>
						<span className="text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 select-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
							Change Profile Picture
						</span>
					</div>
				</div>
			</div>
			<Modal open={menuOpen}>
				<div className="space-y-4">
					<div className="grid xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
						{Object.values(ProfilePictureType).map((profilePictureType) => (
							<div
								key={profilePictureType}
								onClick={() => !(profilePictureType === ProfilePictureType.Custom && !hasCustomProfilePictrue) && setProfilePictureSelected(profilePictureType)}
								className={`${profilePictureSelected === profilePictureType ? 'bg-blue-100 shadow-blue-100 shadow-lg dark:bg-slate-600 dark:shadow-slate-800' : 'border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-700'} ${profilePictureType === ProfilePictureType.Custom && !hasCustomProfilePictrue ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'} m-1 border dark:border-gray-500 shadow rounded p-4 transition-transform hover:z-10 select-none`}
							>
								{profilePictureType === ProfilePictureType.Custom && !hasCustomProfilePictrue ? (
									<div className="w-[150px] h-[150px] text-center mx-auto">
										<p className="text-sm">
											You haven't uploaded a custom profile picture.
											To upload one, you need to create an account
											on <Link href="https://gravatar.com/" target="_blank">gravatar</Link> using
											the same email that you have used here
										</p>
										<Link href="https://en.gravatar.com/support/activating-your-account/" target="_blank">Learn More</Link>
									</div>
								) : (
									<Image
										src={`${constructProfilePicture(profilePictureType, emailHash)}&${profilePictureType === ProfilePictureType.Custom ? 'd=404&' : ''}s=150`}
										alt={`Profile Picture Style`}
										width={150}
										height={150}
										className="rounded-full mx-auto"
										draggable={false}
										onError={() => setHasCustomProfilePictrue(false)}
									/>
								)}
								<p className="text-center mt-4">
									<b>{profilePictureType[0].toUpperCase() + profilePictureType.substring(1)}</b>
								</p>
							</div>
						))}
					</div>
					<p className="text-center my-4">
						These profile pictures are generated based on your email
						by <Link href="https://gravatar.com/" target="_blank">gravatar</Link>,
						this means they will change if you change your email
					</p>
					{errorText && <p className="text-red-500 text-center my-4">{errorText}</p>}
					<div className="flex justify-center gap-1 mx-auto">
						<Button onClick={save} loading={buttonLoading}>
							Save
						</Button>
						<Button buttonStyle="danger" onClick={cancel}>
							Cancel
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
