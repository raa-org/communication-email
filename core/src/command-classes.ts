/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { COMMUNICATION_EMAIL_COMMANDS } from './commands'
import { MODULE_ID } from './prefix'
import type {
  SendCommunicationEmailCommandInterface,
  SendEmailRequest,
} from './types'

export class SendCommunicationEmailCommand
  implements SendCommunicationEmailCommandInterface
{
  static readonly moduleId = MODULE_ID
  static readonly commandName = COMMUNICATION_EMAIL_COMMANDS.SendEmail

  constructor(public readonly payload: SendEmailRequest) {}
}
