/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  SendCommunicationEmailCommand,
  type SendEmailResult,
} from '@rightandabove/communication-email-core'
import { CommunicationEmailDeliveryService } from './communication-email-delivery.service'

@CommandHandler(SendCommunicationEmailCommand)
export class SendCommunicationEmailCommandHandler
  implements ICommandHandler<SendCommunicationEmailCommand, SendEmailResult>
{
  constructor(
    @Inject(CommunicationEmailDeliveryService)
    private readonly deliveryService: CommunicationEmailDeliveryService,
  ) {}

  async execute(
    command: SendCommunicationEmailCommand,
  ): Promise<SendEmailResult> {
    return this.deliveryService.sendEmail(command.payload)
  }
}
