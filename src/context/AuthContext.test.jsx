import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

const mockApi = vi.hoisted(() => ({ post: vi.fn(), get: vi.fn() }))
vi.mock('../services/api', () => ({ default: mockApi }))

function TestConsumer() {
  const { user, login, logout, loading, getRole } = useAuth()

  if (loading) return <div>loading...</div>

  return (
    <div>
      <span data-testid="user">{user?.email || 'null'}</span>
      <span data-testid="role">{getRole() || 'null'}</span>
      <span data-testid="raw-rol">{user?.rol || 'null'}</span>
      <button onClick={() => login({ email: 'a@b.cl', password: '123' })}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('renders with null user when no sessionStorage data', async () => {
    renderWithProvider()
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null')
    })
  })

  it('loads user from sessionStorage on mount', async () => {
    const storedUser = { id: 1, email: 'stored@cl', rol: 'ROLE_ADMIN', nombres: 'A', apellidos: 'B' }
    sessionStorage.setItem('user', JSON.stringify(storedUser))

    renderWithProvider()
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('stored@cl')
    })
    expect(screen.getByTestId('role')).toHaveTextContent('ADMIN')
  })

  it('login sets user from /usuarios/{id} and persists to sessionStorage', async () => {
    const authResponse = { id: 10, email: 'test@colegio.cl', roles: ['ROLE_DOCENTE'] }
    const userResponse = { id: 10, email: 'test@colegio.cl', rol: 'ROLE_DOCENTE', nombres: 'Carlos', apellidos: 'Bravo' }
    mockApi.post.mockResolvedValueOnce({ data: authResponse })
    mockApi.get.mockResolvedValueOnce({ data: userResponse })

    renderWithProvider()
    await waitFor(() => screen.getByTestId('user'))
    await userEvent.click(screen.getByText('login'))

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@colegio.cl')
    })
    expect(screen.getByTestId('role')).toHaveTextContent('DOCENTE')
    const stored = JSON.parse(sessionStorage.getItem('user'))
    expect(stored.nombres).toBe('Carlos')
    expect(mockApi.post).toHaveBeenCalledWith('/auth/authenticate', { email: 'a@b.cl', password: '123' })
    expect(mockApi.get).toHaveBeenCalledWith('/usuarios/10')
  })

  it('login fallback to partialUser when /usuarios/{id} fails', async () => {
    const authResponse = { id: 5, email: 'fallback@cl', roles: ['ROLE_ESTUDIANTE'] }
    mockApi.post.mockResolvedValueOnce({ data: authResponse })
    mockApi.get.mockRejectedValueOnce(new Error('Network error'))

    renderWithProvider()
    await waitFor(() => screen.getByTestId('user'))
    await userEvent.click(screen.getByText('login'))

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('fallback@cl')
    })
    expect(screen.getByTestId('role')).toHaveTextContent('ESTUDIANTE')
    const stored = JSON.parse(sessionStorage.getItem('user'))
    expect(stored.nombres).toBe('')
  })

  it('logout clears user and sessionStorage', async () => {
    const authResponse = { id: 1, email: 'logout@cl', roles: ['ROLE_ADMIN'] }
    const userResponse = { id: 1, email: 'logout@cl', rol: 'ROLE_ADMIN', nombres: 'Admin', apellidos: 'User' }
    mockApi.post.mockResolvedValueOnce({ data: authResponse })
    mockApi.get.mockResolvedValueOnce({ data: userResponse })

    renderWithProvider()
    await waitFor(() => screen.getByTestId('user'))
    await userEvent.click(screen.getByText('login'))
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('logout@cl')
    })

    await userEvent.click(screen.getByText('logout'))
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null')
    })
    expect(sessionStorage.getItem('user')).toBeNull()
  })

  it('getRole extracts role correctly', () => {
    const storedUser = { id: 1, email: 'r@cl', rol: 'ROLE_ADMIN' }
    sessionStorage.setItem('user', JSON.stringify(storedUser))
    renderWithProvider()
    expect(screen.getByTestId('role')).toHaveTextContent('ADMIN')
  })

  it('useAuth outside provider throws error', () => {
    function Broken() {
      useAuth()
      return null
    }
    expect(() => render(<Broken />)).toThrow('useAuth must be used within an AuthProvider')
  })
})
