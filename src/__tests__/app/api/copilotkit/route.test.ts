import { describe, it, expect, vi, beforeEach } from 'vitest'

// Use vi.hoisted to ensure variables are available during mock initialization
const {
  mockCopilotRuntimeCalls,
  mockHttpAgentCalls,
  mockEmptyAdapterCalls,
  mockEndpointCalls,
  mockHandleRequest,
} = vi.hoisted(() => ({
  mockCopilotRuntimeCalls: [] as any[],
  mockHttpAgentCalls: [] as any[],
  mockEmptyAdapterCalls: [] as any[],
  mockEndpointCalls: [] as any[],
  mockHandleRequest: vi.fn(),
}))

vi.mock('@copilotkit/runtime', () => ({
  CopilotRuntime: vi.fn().mockImplementation((...args) => {
    mockCopilotRuntimeCalls.push(args)
    return {}
  }),
  ExperimentalEmptyAdapter: vi.fn().mockImplementation((...args) => {
    mockEmptyAdapterCalls.push(args)
    return {}
  }),
  copilotRuntimeNextJSAppRouterEndpoint: vi.fn().mockImplementation((...args) => {
    mockEndpointCalls.push(args)
    return { handleRequest: mockHandleRequest }
  }),
}))

vi.mock('@ag-ui/client', () => ({
  HttpAgent: vi.fn().mockImplementation((...args) => {
    mockHttpAgentCalls.push(args)
    return { url: args[0]?.url }
  }),
}))

vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
}))

// Import after mocking
import { POST } from '@/app/api/copilotkit/route'

describe('CopilotKit API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHandleRequest.mockReset()
  })

  it('exports a POST handler', () => {
    expect(POST).toBeDefined()
    expect(typeof POST).toBe('function')
  })

  it('POST handler calls handleRequest with the request', async () => {
    const mockRequest = { url: 'http://localhost:3000/api/copilotkit' }
    const mockResponse = new Response('OK')
    mockHandleRequest.mockResolvedValue(mockResponse)

    const result = await POST(mockRequest as any)

    expect(mockHandleRequest).toHaveBeenCalledWith(mockRequest)
    expect(result).toBe(mockResponse)
  })

  it('POST handler returns response from handleRequest', async () => {
    const mockRequest = { url: 'http://localhost:3000/api/copilotkit' }
    const mockResponse = new Response('Test Response')
    mockHandleRequest.mockResolvedValue(mockResponse)

    const result = await POST(mockRequest as any)

    expect(result).toBe(mockResponse)
  })

  it('creates CopilotRuntime with agents configuration', () => {
    // Module was already loaded, check our tracked calls
    expect(mockCopilotRuntimeCalls.length).toBeGreaterThan(0)
    const config = mockCopilotRuntimeCalls[0][0]
    expect(config).toHaveProperty('agents')
    expect(config.agents).toHaveProperty('my_agent')
  })

  it('creates HttpAgent with correct URL', () => {
    expect(mockHttpAgentCalls.length).toBeGreaterThan(0)
    expect(mockHttpAgentCalls[0][0]).toEqual({ url: 'http://localhost:8000/' })
  })

  it('creates ExperimentalEmptyAdapter', () => {
    expect(mockEmptyAdapterCalls.length).toBeGreaterThan(0)
  })

  it('configures endpoint correctly', () => {
    expect(mockEndpointCalls.length).toBeGreaterThan(0)
    const config = mockEndpointCalls[0][0]
    expect(config).toHaveProperty('endpoint', '/api/copilotkit')
  })
})
