/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { Inject, Injectable } from '@nestjs/common'
import { EventBus } from '@nestjs/cqrs'
import { MailerService } from '@nestjs-modules/mailer'
import {
  CommunicationEmailFailedEvent,
  CommunicationEmailSentEvent,
  sendEmailRequestSchema,
  sendEmailResultSchema,
  type CommunicationEmailConfig,
  type EmailRecipient,
  type ParsedSendEmailRequest,
  type SendEmailRequest,
  type SendEmailResult,
} from '@rightandabove/communication-email-core'
import { COMMUNICATION_EMAIL_CONFIG_TOKEN } from './tokens'

interface NormalizedSendEmailRequestInterface {
  from: EmailRecipient
  to: EmailRecipient[]
  cc: EmailRecipient[]
  bcc: EmailRecipient[]
  replyTo: EmailRecipient[]
  subject: string
  text?: string
  html?: string
}

@Injectable()
export class CommunicationEmailDeliveryService {
  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
    @Inject(EventBus) private readonly eventBus: EventBus,
    @Inject(COMMUNICATION_EMAIL_CONFIG_TOKEN)
    private readonly config: CommunicationEmailConfig,
  ) {}

  async sendEmail(request: SendEmailRequest): Promise<SendEmailResult> {
    const validatedRequest = sendEmailRequestSchema.parse(request)
    const normalizedRequest = this.normalizeRequest(validatedRequest)

    try {
      const info = await this.mailerService.sendMail({
        from: this.toMailerRecipient(normalizedRequest.from),
        to: this.toMailerRecipients(normalizedRequest.to),
        ...(normalizedRequest.cc.length > 0
          ? { cc: this.toMailerRecipients(normalizedRequest.cc) }
          : {}),
        ...(normalizedRequest.bcc.length > 0
          ? { bcc: this.toMailerRecipients(normalizedRequest.bcc) }
          : {}),
        ...(normalizedRequest.replyTo.length > 0
          ? { replyTo: this.toMailerRecipients(normalizedRequest.replyTo) }
          : {}),
        subject: normalizedRequest.subject,
        ...(normalizedRequest.text !== undefined
          ? { text: normalizedRequest.text }
          : {}),
        ...(normalizedRequest.html !== undefined
          ? { html: normalizedRequest.html }
          : {}),
      })

      const result = sendEmailResultSchema.parse({
        ok: true,
        messageId: this.readString(info, 'messageId'),
        accepted: this.readStringArray(info, 'accepted'),
        rejected: this.readStringArray(info, 'rejected'),
        pending: this.readStringArray(info, 'pending'),
        response: this.readString(info, 'response'),
        envelope: this.readEnvelope(info),
      })

      this.eventBus.publish(
        new CommunicationEmailSentEvent(
          result.messageId,
          normalizedRequest.subject,
          normalizedRequest.from,
          normalizedRequest.to,
          normalizedRequest.cc,
          normalizedRequest.bcc,
          normalizedRequest.replyTo,
        ),
      )

      return result
    } catch (error) {
      this.eventBus.publish(
        new CommunicationEmailFailedEvent(
          normalizedRequest.subject,
          normalizedRequest.from,
          normalizedRequest.to,
          normalizedRequest.cc,
          normalizedRequest.bcc,
          normalizedRequest.replyTo,
          this.toErrorMessage(error),
        ),
      )
      throw error
    }
  }

  private normalizeRequest(
    request: ParsedSendEmailRequest,
  ): NormalizedSendEmailRequestInterface {
    return {
      from: request.from ?? {
        email: this.config.defaultFromEmail,
        ...(this.config.defaultFromName
          ? { name: this.config.defaultFromName }
          : {}),
      },
      to: this.normalizeRecipients(request.to),
      cc: this.normalizeRecipients(request.cc),
      bcc: this.normalizeRecipients(request.bcc),
      replyTo: this.normalizeRecipients(request.replyTo),
      subject: request.subject,
      ...(request.text !== undefined ? { text: request.text } : {}),
      ...(request.html !== undefined ? { html: request.html } : {}),
    }
  }

  private normalizeRecipients(
    recipients: ParsedSendEmailRequest['to'] | undefined,
  ): EmailRecipient[] {
    if (recipients === undefined) {
      return []
    }

    return Array.isArray(recipients) ? recipients : [recipients]
  }

  private toMailerRecipients(recipients: EmailRecipient[]) {
    return recipients.map((recipient) => this.toMailerRecipient(recipient))
  }

  private toMailerRecipient(recipient: EmailRecipient) {
    if (recipient.name) {
      return `${recipient.name} <${recipient.email}>`
    }

    return recipient.email
  }

  private readString(value: unknown, key: string): string {
    if (
      value &&
      typeof value === 'object' &&
      key in value &&
      typeof (value as Record<string, unknown>)[key] === 'string'
    ) {
      return (value as Record<string, string>)[key]
    }

    return ''
  }

  private readStringArray(value: unknown, key: string): string[] {
    if (!value || typeof value !== 'object' || !(key in value)) {
      return []
    }

    const raw = (value as Record<string, unknown>)[key]
    if (!Array.isArray(raw)) {
      return []
    }

    return raw.flatMap((item) => {
      if (typeof item === 'string') {
        return [item]
      }

      if (
        item &&
        typeof item === 'object' &&
        'address' in item &&
        typeof (item as Record<string, unknown>)['address'] === 'string'
      ) {
        return [(item as Record<string, string>)['address']]
      }

      return []
    })
  }

  private readEnvelope(value: unknown): SendEmailResult['envelope'] {
    if (!value || typeof value !== 'object' || !('envelope' in value)) {
      return { to: [] }
    }

    const envelope = (value as Record<string, unknown>)['envelope']
    if (!envelope || typeof envelope !== 'object') {
      return { to: [] }
    }

    const from =
      'from' in envelope &&
      typeof (envelope as Record<string, unknown>)['from'] === 'string'
        ? (envelope as Record<string, string>)['from']
        : undefined

    const to =
      'to' in envelope
        ? this.readStringArray(
            { to: (envelope as Record<string, unknown>)['to'] },
            'to',
          )
        : []

    return {
      ...(from ? { from } : {}),
      to,
    }
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }

    return 'Unknown email delivery error'
  }
}
