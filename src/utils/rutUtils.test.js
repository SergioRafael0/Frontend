import { describe, it, expect } from 'vitest'
import { formatearRut } from './rutUtils'

describe('formatearRut', () => {
  it('formats a complete RUT with dots and hyphen', () => {
    expect(formatearRut('123456789')).toBe('12.345.678-9')
  })

  it('formats a RUT with letter K as DV', () => {
    expect(formatearRut('12345678K')).toBe('12.345.678-K')
  })

  it('formats a RUT with lowercase k as DV', () => {
    expect(formatearRut('12345678k')).toBe('12.345.678-K')
  })

  it('handles a RUT without formatting (just numbers)', () => {
    expect(formatearRut('111111111')).toBe('11.111.111-1')
  })

  it('strips existing dots and hyphens', () => {
    expect(formatearRut('12.345.678-9')).toBe('12.345.678-9')
  })

  it('truncates input longer than 9 characters', () => {
    expect(formatearRut('1234567890123')).toBe('12.345.678-9')
  })

  it('handles empty string', () => {
    expect(formatearRut('')).toBe('')
  })

  it('handles short RUT (no DV separator)', () => {
    expect(formatearRut('1')).toBe('-1')
  })
})
