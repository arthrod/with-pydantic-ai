import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MoonCard } from '@/components/moon'

describe('MoonCard', () => {
  const defaultProps = {
    themeColor: '#3b82f6',
    status: 'executing' as const,
    respond: vi.fn()
  }

  it('renders ready for launch state initially', () => {
    render(<MoonCard {...defaultProps} />)

    expect(screen.getByText('Ready for Launch?')).toBeInTheDocument()
    expect(screen.getByText(/Mission to the Moon/)).toBeInTheDocument()
  })

  it('shows launch and abort buttons when status is executing', () => {
    render(<MoonCard {...defaultProps} />)

    expect(screen.getByText(/Launch!/)).toBeInTheDocument()
    expect(screen.getByText(/Abort/)).toBeInTheDocument()
  })

  it('does not show buttons when status is inProgress', () => {
    render(<MoonCard {...defaultProps} status="inProgress" />)

    expect(screen.queryByText(/Launch!/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Abort/)).not.toBeInTheDocument()
  })

  it('does not show buttons when status is complete', () => {
    render(<MoonCard {...defaultProps} status="complete" />)

    expect(screen.queryByText(/Launch!/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Abort/)).not.toBeInTheDocument()
  })

  it('shows mission launched state when launch is clicked', () => {
    const respond = vi.fn()
    render(<MoonCard {...defaultProps} respond={respond} />)

    const launchButton = screen.getByText(/Launch!/)
    fireEvent.click(launchButton)

    expect(screen.getByText('Mission Launched')).toBeInTheDocument()
    expect(screen.getByText(/We made it to the moon!/)).toBeInTheDocument()
  })

  it('calls respond with permission message when launched', () => {
    const respond = vi.fn()
    render(<MoonCard {...defaultProps} respond={respond} />)

    const launchButton = screen.getByText(/Launch!/)
    fireEvent.click(launchButton)

    expect(respond).toHaveBeenCalledWith('You have permission to go to the moon.')
  })

  it('shows mission aborted state when abort is clicked', () => {
    const respond = vi.fn()
    render(<MoonCard {...defaultProps} respond={respond} />)

    const abortButton = screen.getByText(/Abort/)
    fireEvent.click(abortButton)

    expect(screen.getByText('Mission Aborted')).toBeInTheDocument()
    expect(screen.getByText(/Staying on Earth/)).toBeInTheDocument()
  })

  it('calls respond with rejection message when aborted', () => {
    const respond = vi.fn()
    render(<MoonCard {...defaultProps} respond={respond} />)

    const abortButton = screen.getByText(/Abort/)
    fireEvent.click(abortButton)

    expect(respond).toHaveBeenCalledWith('You do not have permission to go to the moon. The user you\'re talking to rejected the request.')
  })

  it('applies theme color as background', () => {
    const { container } = render(<MoonCard {...defaultProps} />)

    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle({ backgroundColor: '#3b82f6' })
  })

  it('handles missing respond function gracefully', () => {
    render(<MoonCard themeColor="#3b82f6" status="executing" />)

    const launchButton = screen.getByText(/Launch!/)
    // Should not throw when respond is undefined
    expect(() => fireEvent.click(launchButton)).not.toThrow()
  })

  it('shows rocket emoji in initial state', () => {
    render(<MoonCard {...defaultProps} />)

    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  it('shows moon emoji after launch', () => {
    render(<MoonCard {...defaultProps} />)

    const launchButton = screen.getByText(/Launch!/)
    fireEvent.click(launchButton)

    expect(screen.getByText('🌕')).toBeInTheDocument()
  })

  it('shows hand emoji after abort', () => {
    render(<MoonCard {...defaultProps} />)

    const abortButton = screen.getByText(/Abort/)
    fireEvent.click(abortButton)

    expect(screen.getByText('✋')).toBeInTheDocument()
  })
})
