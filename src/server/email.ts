import ConfirmEmail, {subject as confirmEmailSubject} from './../../emails/confirm-email';
import ResetPassword, {subject as resetPasswordSubject} from './../../emails/reset-password';

import {render} from '@react-email/render';
import {createTransport, getTestMessageUrl} from 'nodemailer';

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
	transporter: Transporter<SMTPTransport.SentMessageInfo> | undefined;
	options: SMTPTransport.Options;

	constructor() {
		console.log('Creating mail transporter');
		try {
			this.options = Email.getOptions();
			this.transporter = createTransport(this.options);
			console.log('Successfully created mail transporter');
		} catch (err) {
			console.error(`Failed to create transporter: ${err.message}`);
			this.transporter = undefined;
		}
	}

	public async send(message: Mail.Options): Promise<SMTPTransport.SentMessageInfo> {
		return new Promise((resolve, reject) => {
			if (!this.transporter) return reject(new Error('No mail transporter configured'));

			this.transporter.sendMail(message, (err, info) => {
				if (err) {
					reject(err);
					return;
				}

				// A testing email account can be generated at ethereal.email
				if (this.options.host === 'smtp.ethereal.email') {
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

	private static getOptions(): SMTPTransport.Options {
		if (!process.env.SMTP_SERVER_HOST) {
			throw new Error('No smtp server provided');
		}

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
}

const email = new Email();
export default email;
