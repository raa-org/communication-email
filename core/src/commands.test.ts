/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest'
import { SendCommunicationEmailCommand } from './command-classes'
import { COMMUNICATION_EMAIL_COMMANDS } from './commands'
import { MODULE_ID } from './prefix'

describe('communication-email command contracts', () => {
  it('declares the send-email command metadata and payload', () => {
    const payload = {
      to: { email: 'user@example.com' },
      subject: 'Welcome',
      text: 'Hello there',
    }
    const command = new SendCommunicationEmailCommand(payload)

    expect(SendCommunicationEmailCommand.moduleId).toBe(MODULE_ID)
    expect(SendCommunicationEmailCommand.commandName).toBe(
      COMMUNICATION_EMAIL_COMMANDS.SendEmail,
    )
    expect(command.payload).toBe(payload)
  })
})
