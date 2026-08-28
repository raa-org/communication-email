/*
 * Copyright (c) 2026 Right&Above, LLC
 * https://rightandabove.com
 * SPDX-License-Identifier: MIT
 */

import type { ComponentType, ReactNode } from 'react'

export interface CommunicationEmailProviderProps {
  children: ReactNode
}

export function CommunicationEmailProvider({
  children,
}: CommunicationEmailProviderProps): ReactNode {
  return children
}

// Structurally compatible with TrustedModuleReactSurface in
// @application-assembly-pipeline/common — the sandbox UI casts to that type
// when it loads the module. The module itself stays free of monorepo deps.
export const surface: {
  Provider: ComponentType<{ children: ReactNode }>
  // routes?:     RouteObject[]
  // navigation?: { label: string; path: string; icon?: string }[]
  // Devtools?:   ComponentType
} = {
  Provider: CommunicationEmailProvider,
}
