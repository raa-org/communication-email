/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import type { z } from 'zod'
import type {
  communicationEmailConfigSchema,
  emailRecipientInputSchema,
  emailRecipientSchema,
  sendEmailRequestSchema,
  sendEmailResultSchema,
} from './schemas'

export type EmailRecipient = z.infer<typeof emailRecipientSchema>
export type EmailRecipientInput = z.input<typeof emailRecipientInputSchema>
export type SendEmailRequest = z.input<typeof sendEmailRequestSchema>
export type ParsedSendEmailRequest = z.output<typeof sendEmailRequestSchema>
export type SendEmailResult = z.infer<typeof sendEmailResultSchema>
export type CommunicationEmailConfig = z.infer<
  typeof communicationEmailConfigSchema
>

export interface SendCommunicationEmailCommandInterface {
  payload: SendEmailRequest
}

export interface CommunicationEmailSentEventInterface {
  messageId: string
  subject: string
  from: EmailRecipient
  to: EmailRecipient[]
  cc: EmailRecipient[]
  bcc: EmailRecipient[]
  replyTo: EmailRecipient[]
}

export interface CommunicationEmailFailedEventInterface {
  subject: string
  from: EmailRecipient
  to: EmailRecipient[]
  cc: EmailRecipient[]
  bcc: EmailRecipient[]
  replyTo: EmailRecipient[]
  errorMessage: string
}
