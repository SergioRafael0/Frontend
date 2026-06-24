import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MainLayout from './MainLayout'

vi.mock('../common/Sidebar', () => ({
  default: ({ open, onClose }) => <div data-testid="sidebar">Sidebar {open ? 'open' : 'closed'}</div>,
}))

vi.mock('../common/Navbar', () => ({
  default: ({ onMenuClick }) => <div data-testid="navbar">Navbar</div>,
}))

vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}))

describe('MainLayout', () => {
  it('renders sidebar, navbar and outlet', () => {
    render(<MainLayout />)

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })
})
