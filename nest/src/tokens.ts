/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { MODULE_ID } from '@rightandabove/communication-email-core'

const TOKEN_NS = `@rightandabove/${MODULE_ID}` as const

export const COMMUNICATION_EMAIL_CONFIG_TOKEN =
  `${TOKEN_NS}/config` as const
