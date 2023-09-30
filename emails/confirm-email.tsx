import {
	Tailwind,
	Html,
	Head,
	Body,
	Preview,
	Container,
	Img,
	Section,
	Heading,
	Text,
} from '@react-email/components';

const assetsBase = process.env.EMAIL_ASSETS_BASE || '';

export interface Props {
	username: string;
	expiryTime: number;
	confirmCode: string;
}

export const subject = 'Confirm your email address';

export default function ConfirmEmail({
	username = 'Daniel',
	expiryTime = 10,
	confirmCode = 'GHA-R9V',
}: Props) {
	return (
		<Html>
			<Head/>
			<Preview>{subject}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans">
					<Container className="border border-solid border-gray-200 rounded m-4 p-6 mx-auto">
						<Section>
							<Img src={`${assetsBase}/android-chrome-192x192.png`} width={48} alt="Accounts logo" className="mx-auto"/>
						</Section>
						<Heading className="text-3xl">Confirm your email address</Heading>
						<Text className="text-xl mb-1">
							Hi {username},
						</Text>
						<Text className="text-lg mt-0">
							Your confirmation code is below, please enter it in the signup window
							you have open and we can continue to get you logged in
						</Text>
						<Section className="bg-gray-200 py-6 text-center">
							<Text className="text-4xl">{confirmCode}</Text>
						</Section>
						<Text>
							The Code will only be valid for the next {expiryTime} minutes
						</Text>
						<Text className="text-gray-600 text-md">
							If you didn't request this code, you can safely ignore this email
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
