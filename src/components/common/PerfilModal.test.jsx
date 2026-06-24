import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PerfilModal from './PerfilModal'

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../../context/AuthContext'

describe('PerfilModal', () => {
  it('renders null when no user', () => {
    useAuth.mockReturnValue({ user: null })

    const { container } = render(<PerfilModal onClose={() => {}} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders user data correctly', () => {
    useAuth.mockReturnValue({
      user: {
        nombres: 'María',
        apellidos: 'González',
        email: 'maria@colegio.cl',
        rut: '12.345.678-9',
        rol: 'ROLE_ADMIN',
      },
    })

    render(<PerfilModal onClose={() => {}} />)

    expect(screen.getByText('MG')).toBeInTheDocument()
    expect(screen.getByText('María González')).toBeInTheDocument()
    expect(screen.getByText('maria@colegio.cl')).toBeInTheDocument()
    expect(screen.getByText('12.345.678-9')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })

  it('calls onClose when clicking overlay', async () => {
    const onClose = vi.fn()
    useAuth.mockReturnValue({
      user: { nombres: 'A', apellidos: 'B', rol: 'ROLE_ESTUDIANTE' },
    })

    render(<PerfilModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /cerrar/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
