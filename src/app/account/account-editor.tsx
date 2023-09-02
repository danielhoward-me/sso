'use client';

import Fieldset from './../components/fieldset';
import MiddleIsland from './../components/middle-island';
import AccountDetailsSection from './account-details-section';
import PasswordSection from './password-section';
import ProfilePictureSection from './profile-picture-section';

import type {UserDetailsValues} from './../utils/get-user-detailsValues';

export default function AccountEditor({user}: {user: UserDetailsValues}) {
	return (
		<MiddleIsland fullWidth>
			<h1 className="text-6xl font-bold pb-2">View Your Account</h1>
			<div className="space-y-1 mt-6">
				<div className="max-w-4xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-[auto_301px] space-y-1 lg:space-x-4 lg:space-y-0">
						<Fieldset title="Account Details">
							<AccountDetailsSection username={user.username} email={user.email}/>
						</Fieldset>
						<Fieldset title="Profile Picture">
							<ProfilePictureSection type={user.profilePicture} emailHash={user.emailHash}/>
						</Fieldset>
					</div>
				</div>
				<div className="max-w-4xl mx-auto">
					<Fieldset title="Password">
						<PasswordSection/>
					</Fieldset>
				</div>
			</div>
		</MiddleIsland>
	);
}
