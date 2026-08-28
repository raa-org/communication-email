/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { EVENT_PREFIX } from './prefix'

/**
 * Authoritative event-name map. CQRS event classes in
 * `./event-classes.ts` use these strings as their static `eventName`,
 * and the manifest's `reservedNamespaces.events` mirrors them so the
 * conflict checker catches cross-module collisions. Never hardcode the
 * strings.
 */
export const COMMUNICATION_EMAIL_EVENTS = {
  EmailSent: `${EVENT_PREFIX}email-sent`,
  EmailFailed: `${EVENT_PREFIX}email-failed`,
} as const

export type CommunicationEmailEventNameType =
  (typeof COMMUNICATION_EMAIL_EVENTS)[keyof typeof COMMUNICATION_EMAIL_EVENTS]
