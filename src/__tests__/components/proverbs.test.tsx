import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProverbsCard } from '@/components/proverbs'
import { AgentState } from '@/lib/types'

describe('ProverbsCard', () => {
  const defaultState: AgentState = {
    proverbs: []
  }

  it('renders the title', () => {
    const setState = vi.fn()
    render(<ProverbsCard state={defaultState} setState={setState} />)

    expect(screen.getByText('Proverbs')).toBeInTheDocument()
  })

  it('shows empty state message when no proverbs', () => {
    const setState = vi.fn()
    render(<ProverbsCard state={defaultState} setState={setState} />)

    expect(screen.getByText(/No proverbs yet/)).toBeInTheDocument()
  })

  it('renders proverbs when provided', () => {
    const state: AgentState = {
      proverbs: ['A penny saved is a penny earned', 'Time is money']
    }
    const setState = vi.fn()
    render(<ProverbsCard state={state} setState={setState} />)

    expect(screen.getByText('A penny saved is a penny earned')).toBeInTheDocument()
    expect(screen.getByText('Time is money')).toBeInTheDocument()
  })

  it('does not show empty state message when proverbs exist', () => {
    const state: AgentState = {
      proverbs: ['Test proverb']
    }
    const setState = vi.fn()
    render(<ProverbsCard state={state} setState={setState} />)

    expect(screen.queryByText(/No proverbs yet/)).not.toBeInTheDocument()
  })

  it('calls setState when delete button is clicked', () => {
    const state: AgentState = {
      proverbs: ['First', 'Second', 'Third']
    }
    const setState = vi.fn()
    render(<ProverbsCard state={state} setState={setState} />)

    // Get all delete buttons
    const deleteButtons = screen.getAllByText('✕')
    expect(deleteButtons).toHaveLength(3)

    // Click the first delete button
    fireEvent.click(deleteButtons[0])

    expect(setState).toHaveBeenCalledWith({
      ...state,
      proverbs: ['Second', 'Third']
    })
  })

  it('removes correct proverb when middle item is deleted', () => {
    const state: AgentState = {
      proverbs: ['First', 'Second', 'Third']
    }
    const setState = vi.fn()
    render(<ProverbsCard state={state} setState={setState} />)

    const deleteButtons = screen.getAllByText('✕')
    fireEvent.click(deleteButtons[1]) // Delete 'Second'

    expect(setState).toHaveBeenCalledWith({
      ...state,
      proverbs: ['First', 'Third']
    })
  })

  it('handles single proverb deletion', () => {
    const state: AgentState = {
      proverbs: ['Only one']
    }
    const setState = vi.fn()
    render(<ProverbsCard state={state} setState={setState} />)

    const deleteButton = screen.getByText('✕')
    fireEvent.click(deleteButton)

    expect(setState).toHaveBeenCalledWith({
      ...state,
      proverbs: []
    })
  })
})
