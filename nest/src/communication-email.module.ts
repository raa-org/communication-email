/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { DynamicModule, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MailerModule } from '@nestjs-modules/mailer'
import {
  communicationEmailConfigSchema,
  type CommunicationEmailConfig,
} from '@rightandabove/communication-email-core'
import { CommunicationEmailDeliveryService } from './communication-email-delivery.service'
import { SendCommunicationEmailCommandHandler } from './send-communication-email-command.handler'
import { COMMUNICATION_EMAIL_CONFIG_TOKEN } from './tokens'

const CommandHandlers = [SendCommunicationEmailCommandHandler]

@Module({})
export class CommunicationEmailModule {
  static forRoot(config: CommunicationEmailConfig): DynamicModule {
    const validatedConfig = communicationEmailConfigSchema.parse(config)

    return {
      module: CommunicationEmailModule,
      imports: [
        CqrsModule,
        MailerModule.forRoot({
          transport: {
            host: validatedConfig.smtpHost,
            port: validatedConfig.smtpPort,
            secure: validatedConfig.smtpSecure,
            ...(validatedConfig.smtpUser && validatedConfig.smtpPassword
              ? {
                  auth: {
                    user: validatedConfig.smtpUser,
                    pass: validatedConfig.smtpPassword,
                  },
                }
              : {}),
          },
          defaults: {
            from: {
              address: validatedConfig.defaultFromEmail,
              ...(validatedConfig.defaultFromName
                ? { name: validatedConfig.defaultFromName }
                : {}),
            },
          },
        }),
      ],
      providers: [
        {
          provide: COMMUNICATION_EMAIL_CONFIG_TOKEN,
          useValue: validatedConfig,
        },
        CommunicationEmailDeliveryService,
        ...CommandHandlers,
      ],
      exports: [],
      global: false,
    }
  }
}
