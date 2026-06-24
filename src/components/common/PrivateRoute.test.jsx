import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivateRoute from './PrivateRoute'

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(({ to }) => <div>redirect:{to}</div>),
}))

import { useAuth } from '../../context/AuthContext'

describe('PrivateRoute', () => {
  it('renders children when user is authenticated', () => {
    useAuth.mockReturnValue({ user: { rol: 'ROLE_ADMIN' }, loading: false })

    render(
      <PrivateRoute>
        <div data-testid="child">protected content</div>
      </PrivateRoute>
    )

    expect(screen.getByTestId('child')).toHaveTextContent('protected content')
  })

  it('redirects to /login when no user', () => {
    useAuth.mockReturnValue({ user: null, loading: false })

    render(
      <PrivateRoute>
        <div>should not render</div>
      </PrivateRoute>
    )

    expect(screen.getByText('redirect:/login')).toBeInTheDocument()
  })

  it('shows loading spinner while loading', () => {
    useAuth.mockReturnValue({ user: null, loading: true })

    render(
      <PrivateRoute>
        <div>should not render</div>
      </PrivateRoute>
    )

    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('redirects to / when role not allowed', () => {
    useAuth.mockReturnValue({ user: { rol: 'ROLE_ESTUDIANTE' }, loading: false })

    render(
      <PrivateRoute roles={['ADMIN']}>
        <div>should not render</div>
      </PrivateRoute>
    )

    expect(screen.getByText('redirect:/')).toBeInTheDocument()
  })
})
