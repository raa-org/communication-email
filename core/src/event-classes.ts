/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { COMMUNICATION_EMAIL_EVENTS } from './events'
import { MODULE_ID } from './prefix'
import type {
  CommunicationEmailFailedEventInterface,
  CommunicationEmailSentEventInterface,
  EmailRecipient,
} from './types'

/**
 * CQRS event classes published via `@nestjs/cqrs` EventBus from the nest
 * package and consumed elsewhere with `@EventsHandler(...)`. Each class
 * declares the two statics the sandbox bridge needs to attribute the
 * event on the workbench Events panel:
 *
 *   - `moduleId`  - this module's `MODULE_ID` constant
 *   - `eventName` - the dotted name from `COMMUNICATION_EMAIL_EVENTS`
 *                   that mirrors `manifest.reservedNamespaces.events[]`
 *
 * Other modules import these classes from `@rightandabove/communication-email-core` (NEVER
 * from the nest package) when registering cross-module
 * `@EventsHandler(...)`, so a subscriber never picks up this module's
 * server-only DI graph.
 */

export class CommunicationEmailSentEvent
  implements CommunicationEmailSentEventInterface
{
  static readonly moduleId = MODULE_ID
  static readonly eventName = COMMUNICATION_EMAIL_EVENTS.EmailSent

  constructor(
    public readonly messageId: string,
    public readonly subject: string,
    public readonly from: EmailRecipient,
    public readonly to: EmailRecipient[],
    public readonly cc: EmailRecipient[],
    public readonly bcc: EmailRecipient[],
    public readonly replyTo: EmailRecipient[],
  ) {}
}

export class CommunicationEmailFailedEvent
  implements CommunicationEmailFailedEventInterface
{
  static readonly moduleId = MODULE_ID
  static readonly eventName = COMMUNICATION_EMAIL_EVENTS.EmailFailed

  constructor(
    public readonly subject: string,
    public readonly from: EmailRecipient,
    public readonly to: EmailRecipient[],
    public readonly cc: EmailRecipient[],
    public readonly bcc: EmailRecipient[],
    public readonly replyTo: EmailRecipient[],
    public readonly errorMessage: string,
  ) {}
}
