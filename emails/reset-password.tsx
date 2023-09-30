import {
	Tailwind,
	Html,
	Head,
	Body,
	Button,
	Link,
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
	resetPasswordLink: string;
}

export const subject = 'Reset your password';

export default function ResetPassword({
	username = 'Daniel',
	expiryTime = 10,
	resetPasswordLink = 'https://sso.danielhoward.me',
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
						<Heading className="text-3xl">Reset your password</Heading>
						<Text className="text-xl mb-1">
							Hi {username},
						</Text>
						<Text className="text-lg mt-0">
							Please click the button below and you will be prompted
							to change your account's password
						</Text>
						<Text className="text-lg mt-0 text-red-600">
							Do not share this link with anyone, as it may give them
							full access to your account
						</Text>
						<Section className="py-6 text-center">
							<Button href={resetPasswordLink} className="bg-blue-600 rounded font-bold text-white text-lg py-5 px-20">
								Reset your password
							</Button>
						</Section>
						<Text>
							If the button doesn't work, please click the following link: <Link href={resetPasswordLink}>{resetPasswordLink}</Link>
						</Text>
						<Text>
							The Link will only be valid for the next {expiryTime} minutes
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
