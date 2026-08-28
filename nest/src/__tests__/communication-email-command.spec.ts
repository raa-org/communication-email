/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it, vi } from 'vitest'
import { MailerService } from '@nestjs-modules/mailer'
import { Test, type TestingModule } from '@nestjs/testing'
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs'
import {
  CommunicationEmailFailedEvent,
  CommunicationEmailSentEvent,
  SendCommunicationEmailCommand,
  type CommunicationEmailConfig,
} from '@rightandabove/communication-email-core'
import { CommunicationEmailModule } from '../communication-email.module'
import { CommunicationEmailDeliveryService } from '../communication-email-delivery.service'
import { SendCommunicationEmailCommandHandler } from '../send-communication-email-command.handler'
import { COMMUNICATION_EMAIL_CONFIG_TOKEN } from '../tokens'

const testConfig: CommunicationEmailConfig = {
  smtpHost: 'localhost',
  smtpPort: 1025,
  smtpSecure: false,
  defaultFromEmail: 'noreply@example.com',
  defaultFromName: 'Notifications',
}

async function createEmailTestingModule(
  sendMail: ReturnType<typeof vi.fn>,
): Promise<TestingModule> {
  const moduleRef = await Test.createTestingModule({
    imports: [CqrsModule.forRoot()],
    providers: [
      CommunicationEmailDeliveryService,
      SendCommunicationEmailCommandHandler,
      {
        provide: COMMUNICATION_EMAIL_CONFIG_TOKEN,
        useValue: testConfig,
      },
      {
        provide: MailerService,
        useValue: { sendMail },
      },
    ],
  }).compile()

  await moduleRef.init()
  return moduleRef
}

describe('CommunicationEmail command flow', () => {
  it('executes SendCommunicationEmailCommand, returns a typed result, and publishes CommunicationEmailSentEvent', async () => {
    const sendMail = vi.fn(async () => ({
      messageId: 'message-1',
      accepted: ['user@example.com'],
      rejected: [],
      pending: [],
      response: '250 queued',
      envelope: {
        from: 'noreply@example.com',
        to: ['user@example.com'],
      },
    }))

    const moduleRef = await createEmailTestingModule(sendMail)
    const commandBus = moduleRef.get(CommandBus)
    const eventBus = moduleRef.get(EventBus)
    const captured: object[] = []
    const subscription = eventBus.subscribe((event) => captured.push(event as object))

    const result = await commandBus.execute(
      new SendCommunicationEmailCommand({
        to: 'user@example.com',
        cc: 'manager@example.com',
        replyTo: { email: 'support@example.com', name: 'Support' },
        subject: 'Welcome',
        text: 'Hello there',
      }),
    )

    expect(sendMail).toHaveBeenCalledWith({
      from: 'Notifications <noreply@example.com>',
      to: ['user@example.com'],
      cc: ['manager@example.com'],
      replyTo: ['Support <support@example.com>'],
      subject: 'Welcome',
      text: 'Hello there',
    })
    expect(result).toEqual({
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

    const sentEvents = captured.filter(
      (event): event is CommunicationEmailSentEvent =>
        event instanceof CommunicationEmailSentEvent,
    )
    expect(sentEvents).toHaveLength(1)
    expect(sentEvents[0]!.messageId).toBe('message-1')
    expect(sentEvents[0]!.subject).toBe('Welcome')

    subscription.unsubscribe()
    await moduleRef.close()
  })

  it('rejects invalid command payloads before calling the mailer', async () => {
    const sendMail = vi.fn()
    const moduleRef = await createEmailTestingModule(sendMail)
    const commandBus = moduleRef.get(CommandBus)

    await expect(
      commandBus.execute(
        new SendCommunicationEmailCommand({
          to: { email: 'user@example.com' },
          subject: 'Missing body',
        }),
      ),
    ).rejects.toThrow(/either text or html must be provided/)
    expect(sendMail).not.toHaveBeenCalled()

    await moduleRef.close()
  })

  it('publishes CommunicationEmailFailedEvent when command delivery fails', async () => {
    const sendMail = vi.fn(async () => {
      throw new Error('smtp unavailable')
    })

    const moduleRef = await createEmailTestingModule(sendMail)
    const commandBus = moduleRef.get(CommandBus)
    const eventBus = moduleRef.get(EventBus)
    const captured: object[] = []
    const subscription = eventBus.subscribe((event) => captured.push(event as object))

    await expect(
      commandBus.execute(
        new SendCommunicationEmailCommand({
          to: { email: 'user@example.com' },
          subject: 'Failure case',
          html: '<p>Hello</p>',
        }),
      ),
    ).rejects.toThrow('smtp unavailable')

    const failedEvents = captured.filter(
      (event): event is CommunicationEmailFailedEvent =>
        event instanceof CommunicationEmailFailedEvent,
    )
    expect(failedEvents).toHaveLength(1)
    expect(failedEvents[0]!.errorMessage).toBe('smtp unavailable')
    expect(failedEvents[0]!.subject).toBe('Failure case')

    subscription.unsubscribe()
    await moduleRef.close()
  })
})

describe('CommunicationEmailModule.forRoot', () => {
  it('validates config via Zod before the module is created', () => {
    expect(() =>
      CommunicationEmailModule.forRoot({
        smtpHost: 'localhost',
        smtpPort: 1025,
        smtpUser: 'mailer',
        defaultFromEmail: 'noreply@example.com',
      } as unknown as CommunicationEmailConfig),
    ).toThrow(/smtpUser and smtpPassword must be provided together/)
  })
})
