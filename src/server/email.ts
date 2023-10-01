import ConfirmEmail, {subject as confirmEmailSubject} from './../../emails/confirm-email';
import ResetPassword, {subject as resetPasswordSubject} from './../../emails/reset-password';

import {render} from '@react-email/render';
import {createTransport, createTestAccount, getTestMessageUrl} from 'nodemailer';

import type {Props as ConfirmEmailProps} from './../../emails/confirm-email';
import type {Props as ResetPasswordProps} from './../../emails/reset-password';
import type {Transporter} from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export enum EmailTemplate {
	ConfirmEmail = 'confirm-email',
	ResetPassword = 'reset-password',
}
const templateSubjects: Record<EmailTemplate, string> = {
	[EmailTemplate.ConfirmEmail]: confirmEmailSubject,
	[EmailTemplate.ResetPassword]: resetPasswordSubject,
};

class Email {
	transporter: Transporter<SMTPTransport.SentMessageInfo>;
	optionsPromise: Promise<SMTPTransport.Options>;

	constructor() {
		console.log('Creating mail transporter');
		this.createTransporter()
			.then(() => console.log('Successfully created mail transporter'))
			.catch((err) => console.error(`Failed to create transporter: ${err.message}`));
	}

	private async createTransporter() {
		this.optionsPromise = process.env.NODE_ENV === 'production' ? (
			Email.getProductionOptions()
		) : (
			Email.getTestAccountOptions()
		);

		this.transporter = createTransport(await this.optionsPromise);
	}

	private async waitForOptions() {
		if (this.transporter || !this.optionsPromise) return;
		await this.optionsPromise;
	}

	public async send(message: Mail.Options): Promise<SMTPTransport.SentMessageInfo> {
		await this.waitForOptions();

		return new Promise((resolve, reject) => {
			this.transporter.sendMail(message, (err, info) => {
				if (err) {
					reject(err);
					return;
				}

				if (process.env.NODE_ENV !== 'production') {
					console.log(`Email sent to ${message.to}: ${info.messageId}`);
					console.log(`Preview URL: ${getTestMessageUrl(info)}`);
				}

				resolve(info);
			});
		});
	}

	public async sendTemplate(to: string, type: EmailTemplate.ConfirmEmail, props: Parameters<typeof ConfirmEmail>[0]): Promise<void>
	public async sendTemplate(to: string, type: EmailTemplate.ResetPassword, props: Parameters<typeof ResetPassword>[0]): Promise<void>
	public async sendTemplate(to: string, type: EmailTemplate, props: unknown): Promise<void> {
		await this.waitForOptions();

		if (!this.transporter) {
			console.log('No mail has been sent due to there not being a transporter');
			console.log(`A ${type} email would have been sent with the following parameters: `, props);
			return;
		}

		let renderedTemplate: JSX.Element;
		switch (type) {
		case EmailTemplate.ConfirmEmail:
			renderedTemplate = ConfirmEmail(props as ConfirmEmailProps);
			break;
		case EmailTemplate.ResetPassword:
			renderedTemplate = ResetPassword(props as ResetPasswordProps);
			break;
		}

		await email.send({
			from: process.env.EMAIL_FROM,
			to,
			subject: templateSubjects[type],
			text: render(renderedTemplate, {plainText: true}),
			html: render(renderedTemplate),
		});
	}

	private static async getProductionOptions(): Promise<SMTPTransport.Options> {
		return {
			host: process.env.SMTP_SERVER_HOST,
			port: parseInt(process.env.SMTP_SERVER_PORT || ''),
			secure: process.env.SMTP_SERVER_SECURE === 'true',
			auth: {
				user: process.env.SMTP_SERVER_USER,
				pass: process.env.SMTP_SERVER_PASS,
			},
		};
	}

	private static getTestAccountOptions(): Promise<SMTPTransport.Options> {
		return new Promise((resolve, reject) => {
			if (process.env.NODE_ENV === 'production') reject(new Error('Test email account cannot be used in production'));

			createTestAccount((err, account) => {
				if (err) reject(new Error('Failed to create ann email testing account: ' + err.message));

				console.log('Testing account created');

				resolve({
					host: account.smtp.host,
					port: account.smtp.port,
					secure: account.smtp.secure,
					auth: {
						user: account.user,
						pass: account.pass,
					},
				});
			});
		});
	}
}

const email = new Email();
export default email;
