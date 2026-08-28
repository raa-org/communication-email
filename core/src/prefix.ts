/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

/**
 * Single source of truth for module-scoped naming. Every route, event,
 * Redux action type, slice key and DI token in this module is derived
 * from `MODULE_ID` so two trusted modules can never collide on a shared
 * symbol space. See docs/trusted-modules.md for the contract.
 */
export const MODULE_ID = 'communication-email'

/** HTTP route prefix, e.g. `/communication-email`. */
export const ROUTE_PREFIX = `/${MODULE_ID}` as const

/**
 * Redux slice key - the camelCase form of MODULE_ID.
 */
export const SLICE_NAME = 'communicationEmail' as const

/** Redux action type prefix, e.g. `communication-email/`. */
export const ACTION_PREFIX = `${MODULE_ID}/` as const

/** Event name prefix on the sandbox event bus, e.g. `communication-email.`. */
export const EVENT_PREFIX = `${MODULE_ID}.` as const
