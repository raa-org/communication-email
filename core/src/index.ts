/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

// Public API of @rightandabove/communication-email-core.
//
// Contains ONLY what is shared between the nest and react packages:
// prefix system, route map, event names, CQRS event classes, Zod
// schemas, DTO types. Server-only concerns (DI tokens, abstractions)
// live in @rightandabove/communication-email-nest so the frontend bundle never pulls them in.

export * from './prefix'
export * from './routes'
export * from './schemas'
export * from './types'
export * from './commands'
export * from './command-classes'
export * from './events'
export * from './event-classes'
