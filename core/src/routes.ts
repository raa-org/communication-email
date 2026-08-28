/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import { ROUTE_PREFIX } from './prefix'

/**
 * Authoritative route map for the communication-email HTTP surface.
 *
 * This module exposes a service-only server API and does not mount HTTP
 * endpoints of its own, so the route map is intentionally empty. Keep
 * `ROUTE_PREFIX` exported as part of the shared prefix system and mirror
 * the empty route set in `manifest.integration.reservedNamespaces.routes`.
 */
void ROUTE_PREFIX

export const COMMUNICATION_EMAIL_ROUTES = {} as const

export type CommunicationEmailRouteType =
  (typeof COMMUNICATION_EMAIL_ROUTES)[keyof typeof COMMUNICATION_EMAIL_ROUTES]
