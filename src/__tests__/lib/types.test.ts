import { describe, it, expect } from 'vitest'
import type { AgentState } from '@/lib/types'
import { createDefaultAgentState } from '@/lib/types'

describe('AgentState type', () => {
  it('allows valid AgentState with proverbs array', () => {
    const state: AgentState = {
      proverbs: ['Test proverb 1', 'Test proverb 2']
    }

    expect(state.proverbs).toHaveLength(2)
    expect(state.proverbs[0]).toBe('Test proverb 1')
  })

  it('allows empty proverbs array', () => {
    const state: AgentState = {
      proverbs: []
    }

    expect(state.proverbs).toHaveLength(0)
  })

  it('proverbs array contains strings', () => {
    const state: AgentState = {
      proverbs: ['Only strings allowed']
    }

    expect(typeof state.proverbs[0]).toBe('string')
  })
})

describe('createDefaultAgentState', () => {
  it('returns empty proverbs array', () => {
    const state = createDefaultAgentState()

    expect(state.proverbs).toEqual([])
  })

  it('returns a new object each time', () => {
    const state1 = createDefaultAgentState()
    const state2 = createDefaultAgentState()

    expect(state1).not.toBe(state2)
    expect(state1).toEqual(state2)
  })

  it('returns object with correct shape', () => {
    const state = createDefaultAgentState()

    expect(state).toHaveProperty('proverbs')
    expect(Array.isArray(state.proverbs)).toBe(true)
  })
})
