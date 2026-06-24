import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('./PerfilModal', () => ({
  default: ({ onClose }) => <div data-testid="perfil-modal">PerfilModal</div>,
}))

import { useAuth } from '../../context/AuthContext'

describe('Navbar', () => {
  it('renders null when no user', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn(), getRole: vi.fn() })

    const { container } = render(<Navbar onMenuClick={() => {}} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders user initials and name', () => {
    useAuth.mockReturnValue({
      user: { nombres: 'Carlos', apellidos: 'Bravo', rol: 'ROLE_DOCENTE' },
      logout: vi.fn(),
      getRole: () => 'DOCENTE',
    })

    render(<Navbar onMenuClick={() => {}} />)
    expect(screen.getByText('CB')).toBeInTheDocument()
    expect(screen.getByText('Carlos Bravo')).toBeInTheDocument()
  })

  it('calls logout and navigates to /login on Salir click', async () => {
    const mockLogout = vi.fn().mockResolvedValue()
    useAuth.mockReturnValue({
      user: { nombres: 'Admin', apellidos: 'User', rol: 'ROLE_ADMIN' },
      logout: mockLogout,
      getRole: () => 'ADMIN',
    })

    render(<Navbar onMenuClick={() => {}} />)
    await userEvent.click(screen.getByText('Salir'))

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('opens PerfilModal on user button click', async () => {
    useAuth.mockReturnValue({
      user: { nombres: 'A', apellidos: 'B', rol: 'ROLE_ADMIN' },
      logout: vi.fn(),
      getRole: () => 'ADMIN',
    })

    render(<Navbar onMenuClick={() => {}} />)
    expect(screen.queryByTestId('perfil-modal')).not.toBeInTheDocument()

    await userEvent.click(screen.getByText('AB'))
    expect(screen.getByTestId('perfil-modal')).toBeInTheDocument()
  })
})
