/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest'
import {
  communicationEmailConfigSchema,
  sendEmailRequestSchema,
  sendEmailResultSchema,
} from './schemas'

describe('communication-email core schemas', () => {
  it('parses valid SMTP config and applies defaults', () => {
    const parsed = communicationEmailConfigSchema.parse({
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      defaultFromEmail: 'noreply@example.com',
      defaultFromName: 'Notifications',
    })

    expect(parsed).toEqual({
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpSecure: false,
      defaultFromEmail: 'noreply@example.com',
      defaultFromName: 'Notifications',
    })
  })

  it('rejects partial SMTP auth config', () => {
    expect(() =>
      communicationEmailConfigSchema.parse({
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: 'mailer',
        defaultFromEmail: 'noreply@example.com',
      }),
    ).toThrow(/smtpUser and smtpPassword must be provided together/)
  })

  it('parses a send-email request with html and recipient lists', () => {
    const parsed = sendEmailRequestSchema.parse({
      to: [
        { email: 'user@example.com', name: 'User' },
        'ADMIN@example.com',
      ],
      cc: 'cc@example.com',
      replyTo: { email: 'reply@example.com', name: 'Reply Team' },
      subject: 'Welcome',
      html: '<p>Hello</p>',
    })

    expect(parsed.subject).toBe('Welcome')
    expect(parsed.to).toHaveLength(2)
    expect(parsed.to).toEqual([
      { email: 'user@example.com', name: 'User' },
      { email: 'admin@example.com' },
    ])
    expect(parsed.cc).toEqual({ email: 'cc@example.com' })
  })

  it('rejects a request without text or html content', () => {
    expect(() =>
      sendEmailRequestSchema.parse({
        to: { email: 'user@example.com' },
        subject: 'Missing body',
      }),
    ).toThrow(/either text or html must be provided/)
  })

  it('parses a typed send result', () => {
    const parsed = sendEmailResultSchema.parse({
      ok: true,
      messageId: 'message-1',
      accepted: ['user@example.com'],
      rejected: [],
      pending: [],
      response: '250 queued',
      envelope: {
        from: 'noreply@example.com',
        to: ['user@example.com'],
      },
    })

    expect(parsed.ok).toBe(true)
    expect(parsed.messageId).toBe('message-1')
  })
})
