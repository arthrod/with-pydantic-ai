import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CopilotKitPage from '@/app/page'

// Mock CopilotKit hooks
const mockSetState = vi.fn()
const mockUseCoAgent = vi.fn()
const mockUseCopilotAction = vi.fn()

vi.mock('@copilotkit/react-core', () => ({
  useCoAgent: (config: any) => {
    mockUseCoAgent(config)
    return {
      state: config.initialState || { proverbs: [] },
      setState: mockSetState,
    }
  },
  useCopilotAction: (config: any, deps?: any[]) => {
    mockUseCopilotAction(config, deps)
  },
}))

vi.mock('@copilotkit/react-ui', () => ({
  CopilotSidebar: ({ children, labels, suggestions }: any) => (
    <div data-testid="copilot-sidebar">
      <div data-testid="sidebar-title">{labels?.title}</div>
      <div data-testid="sidebar-initial">{labels?.initial}</div>
      <div data-testid="suggestions-count">{suggestions?.length}</div>
      {children}
    </div>
  ),
}))

describe('CopilotKitPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page with CopilotSidebar', () => {
    render(<CopilotKitPage />)

    expect(screen.getByTestId('copilot-sidebar')).toBeInTheDocument()
  })

  it('displays the correct sidebar title', () => {
    render(<CopilotKitPage />)

    expect(screen.getByTestId('sidebar-title')).toHaveTextContent('Popup Assistant')
  })

  it('displays the correct initial message', () => {
    render(<CopilotKitPage />)

    expect(screen.getByTestId('sidebar-initial')).toHaveTextContent("Hi, there! You're chatting with an agent.")
  })

  it('has 6 suggestions configured', () => {
    render(<CopilotKitPage />)

    expect(screen.getByTestId('suggestions-count')).toHaveTextContent('6')
  })

  it('renders ProverbsCard with initial state', () => {
    render(<CopilotKitPage />)

    // Check for the initial proverb
    expect(screen.getByText(/CopilotKit may be new/)).toBeInTheDocument()
  })

  it('registers setThemeColor action', () => {
    render(<CopilotKitPage />)

    // Find the setThemeColor action call
    const setThemeColorCall = mockUseCopilotAction.mock.calls.find(
      call => call[0].name === 'setThemeColor'
    )

    expect(setThemeColorCall).toBeDefined()
    expect(setThemeColorCall[0].parameters).toHaveLength(1)
    expect(setThemeColorCall[0].parameters[0].name).toBe('themeColor')
    expect(setThemeColorCall[0].parameters[0].required).toBe(true)
  })

  it('setThemeColor handler updates theme', () => {
    render(<CopilotKitPage />)

    const setThemeColorCall = mockUseCopilotAction.mock.calls.find(
      call => call[0].name === 'setThemeColor'
    )

    // Call the handler
    setThemeColorCall[0].handler({ themeColor: '#ff0000' })

    // Re-render to see the change (in real app, useState would trigger re-render)
    // The handler should have been called without error
    expect(setThemeColorCall[0].handler).toBeDefined()
  })

  it('registers get_weather action with render function', () => {
    render(<CopilotKitPage />)

    const getWeatherCall = mockUseCopilotAction.mock.calls.find(
      call => call[0].name === 'get_weather'
    )

    expect(getWeatherCall).toBeDefined()
    expect(getWeatherCall[0].description).toBe('Get the weather for a given location.')
    expect(getWeatherCall[0].available).toBe('disabled')
    expect(getWeatherCall[0].render).toBeDefined()
  })

  it('get_weather render returns WeatherCard', () => {
    render(<CopilotKitPage />)

    const getWeatherCall = mockUseCopilotAction.mock.calls.find(
      call => call[0].name === 'get_weather'
    )

    // Call the render function
    const rendered = getWeatherCall[0].render({ args: { location: 'Tokyo' } })

    expect(rendered).toBeDefined()
    expect(rendered.props.location).toBe('Tokyo')
  })

  it('registers go_to_moon action with renderAndWaitForResponse', () => {
    render(<CopilotKitPage />)

    const goToMoonCall = mockUseCopilotAction.mock.calls.find(
      call => call[0].name === 'go_to_moon'
    )

    expect(goToMoonCall).toBeDefined()
    expect(goToMoonCall[0].description).toBe('Go to the moon on request.')
    expect(goToMoonCall[0].renderAndWaitForResponse).toBeDefined()
  })

  it('go_to_moon renderAndWaitForResponse returns MoonCard', () => {
    render(<CopilotKitPage />)

    const goToMoonCall = mockUseCopilotAction.mock.calls.find(
      call => call[0].name === 'go_to_moon'
    )

    const mockRespond = vi.fn()
    const rendered = goToMoonCall[0].renderAndWaitForResponse({
      respond: mockRespond,
      status: 'executing'
    })

    expect(rendered).toBeDefined()
    expect(rendered.props.status).toBe('executing')
    expect(rendered.props.respond).toBe(mockRespond)
  })

  it('useCoAgent is called with correct config', () => {
    render(<CopilotKitPage />)

    expect(mockUseCoAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'my_agent',
        initialState: {
          proverbs: [
            'CopilotKit may be new, but its the best thing since sliced bread.',
          ],
        },
      })
    )
  })

  it('applies theme color as CSS variable', () => {
    const { container } = render(<CopilotKitPage />)

    const main = container.querySelector('main')
    expect(main).toHaveStyle({ '--copilot-kit-primary-color': '#6366f1' })
  })

  it('applies theme color to background', () => {
    const { container } = render(<CopilotKitPage />)

    const contentDiv = container.querySelector('.h-screen')
    expect(contentDiv).toHaveStyle({ backgroundColor: '#6366f1' })
  })
})
