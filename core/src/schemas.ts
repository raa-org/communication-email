/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { z } from 'zod'

const trimmedStringSchema = z.string().trim().min(1)
const optionalTrimmedStringSchema = z.string().trim().min(1).optional()

export const emailRecipientSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: optionalTrimmedStringSchema,
})

export const emailRecipientInputSchema = z
  .union([z.string().trim().toLowerCase().email(), emailRecipientSchema])
  .transform((recipient) =>
    typeof recipient === 'string' ? { email: recipient } : recipient,
  )

export const emailRecipientsSchema = z.union([
  emailRecipientInputSchema,
  z.array(emailRecipientInputSchema).min(1),
])

export const communicationEmailConfigSchema = z
  .object({
    smtpHost: trimmedStringSchema,
    smtpPort: z.number().int().min(1).max(65535),
    smtpSecure: z.boolean().default(false),
    smtpUser: optionalTrimmedStringSchema,
    smtpPassword: optionalTrimmedStringSchema,
    defaultFromEmail: z.string().trim().toLowerCase().email(),
    defaultFromName: optionalTrimmedStringSchema,
  })
  .superRefine((value, ctx) => {
    const hasUser = value.smtpUser !== undefined
    const hasPassword = value.smtpPassword !== undefined

    if (hasUser !== hasPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: hasUser ? ['smtpPassword'] : ['smtpUser'],
        message: 'smtpUser and smtpPassword must be provided together',
      })
    }
  })

export const sendEmailRequestSchema = z
  .object({
    from: emailRecipientInputSchema.optional(),
    to: emailRecipientsSchema,
    cc: emailRecipientsSchema.optional(),
    bcc: emailRecipientsSchema.optional(),
    replyTo: emailRecipientsSchema.optional(),
    subject: trimmedStringSchema.max(998),
    text: optionalTrimmedStringSchema,
    html: optionalTrimmedStringSchema,
  })
  .superRefine((value, ctx) => {
    if (value.text === undefined && value.html === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['text'],
        message: 'either text or html must be provided',
      })
    }
  })

export const sendEmailResultSchema = z.object({
  ok: z.literal(true),
  messageId: trimmedStringSchema,
  accepted: z.array(trimmedStringSchema).default([]),
  rejected: z.array(trimmedStringSchema).default([]),
  pending: z.array(trimmedStringSchema).default([]),
  response: z.string().default(''),
  envelope: z.object({
    from: z.string().optional(),
    to: z.array(trimmedStringSchema).default([]),
  }),
})
