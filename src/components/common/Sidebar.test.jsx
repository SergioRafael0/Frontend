import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Sidebar from './Sidebar'

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  NavLink: vi.fn(({ to, children, className }) => {
    const css = typeof className === 'function' ? className({ isActive: false }) : className
    return <a href={to} className={css}>{children}</a>
  }),
}))

import { useAuth } from '../../context/AuthContext'

describe('Sidebar', () => {
  it('renders admin menu items', () => {
    useAuth.mockReturnValue({ getRole: () => 'ADMIN' })
    render(<Sidebar open={false} onClose={() => {}} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Cursos')).toBeInTheDocument()
    expect(screen.getByText('Asignaturas')).toBeInTheDocument()
    expect(screen.getByText('Matrículas')).toBeInTheDocument()
    expect(screen.getByText('Asistencias')).toBeInTheDocument()
    expect(screen.getByText('Anotaciones')).toBeInTheDocument()
    expect(screen.getByText('Calificaciones')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(8)
  })

  it('renders docente menu items', () => {
    useAuth.mockReturnValue({ getRole: () => 'DOCENTE' })
    render(<Sidebar open={false} onClose={() => {}} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Cursos')).toBeInTheDocument()
    expect(screen.getByText('Mis Asignaturas')).toBeInTheDocument()
    expect(screen.getByText('Registrar Asistencia')).toBeInTheDocument()
    expect(screen.getByText('Anotaciones')).toBeInTheDocument()
    expect(screen.getByText('Notas')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(6)
  })

  it('renders estudiante menu items', () => {
    useAuth.mockReturnValue({ getRole: () => 'ESTUDIANTE' })
    render(<Sidebar open={false} onClose={() => {}} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Mis Asignaturas')).toBeInTheDocument()
    expect(screen.getByText('Mi Asistencia')).toBeInTheDocument()
    expect(screen.getByText('Mis Notas')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })

  it('renders empty nav when no role', () => {
    useAuth.mockReturnValue({ getRole: () => null })
    render(<Sidebar open={false} onClose={() => {}} />)

    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})
