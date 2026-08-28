/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { MODULE_ID } from './prefix'

export const COMMUNICATION_EMAIL_COMMANDS = {
  SendEmail: `${MODULE_ID}.send-email`,
} as const

export type CommunicationEmailCommandNameType =
  (typeof COMMUNICATION_EMAIL_COMMANDS)[keyof typeof COMMUNICATION_EMAIL_COMMANDS]
