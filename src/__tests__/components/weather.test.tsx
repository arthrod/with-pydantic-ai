import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeatherCard } from '@/components/weather'

describe('WeatherCard', () => {
  const defaultProps = {
    location: 'New York',
    themeColor: '#3b82f6'
  }

  it('renders the location', () => {
    render(<WeatherCard {...defaultProps} />)

    expect(screen.getByText('New York')).toBeInTheDocument()
  })

  it('displays current weather label', () => {
    render(<WeatherCard {...defaultProps} />)

    expect(screen.getByText('Current Weather')).toBeInTheDocument()
  })

  it('shows temperature', () => {
    render(<WeatherCard {...defaultProps} />)

    expect(screen.getByText('70°')).toBeInTheDocument()
  })

  it('shows clear skies', () => {
    render(<WeatherCard {...defaultProps} />)

    expect(screen.getByText('Clear skies')).toBeInTheDocument()
  })

  it('displays humidity', () => {
    render(<WeatherCard {...defaultProps} />)

    expect(screen.getByText('Humidity')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('displays wind speed', () => {
    render(<WeatherCard {...defaultProps} />)

    expect(screen.getByText('Wind')).toBeInTheDocument()
    expect(screen.getByText('5 mph')).toBeInTheDocument()
  })

  it('displays feels like temperature', () => {
    render(<WeatherCard {...defaultProps} />)

    expect(screen.getByText('Feels Like')).toBeInTheDocument()
    expect(screen.getByText('72°')).toBeInTheDocument()
  })

  it('applies theme color as background', () => {
    const { container } = render(<WeatherCard {...defaultProps} />)

    const card = container.firstChild as HTMLElement
    expect(card).toHaveStyle({ backgroundColor: '#3b82f6' })
  })

  it('handles different locations', () => {
    render(<WeatherCard location="Tokyo" themeColor="#10b981" />)

    expect(screen.getByText('Tokyo')).toBeInTheDocument()
  })

  it('handles undefined location', () => {
    render(<WeatherCard location={undefined} themeColor="#3b82f6" />)

    // Should not crash, location will be undefined/empty
    expect(screen.getByText('Current Weather')).toBeInTheDocument()
  })
})
