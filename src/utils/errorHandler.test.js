import { describe, it, expect } from 'vitest'
import { getErrorMessage } from './errorHandler'

describe('getErrorMessage', () => {
  it('returns message from response.data.message', () => {
    const err = { response: { data: { message: 'Email ya registrado' } } }
    expect(getErrorMessage(err)).toBe('Email ya registrado')
  })

  it('returns message when response.data is a string', () => {
    const err = { response: { data: 'Error en el servidor' } }
    expect(getErrorMessage(err)).toBe('Error en el servidor')
  })

  it('returns message from response.data.error', () => {
    const err = { response: { data: { error: 'Token inválido' } } }
    expect(getErrorMessage(err)).toBe('Token inválido')
  })

  it('returns access denied for 403', () => {
    const err = { response: { status: 403 } }
    expect(getErrorMessage(err)).toBe('Acceso denegado. No tienes permisos para esta acción.')
  })

  it('returns not found for 404', () => {
    const err = { response: { status: 404 } }
    expect(getErrorMessage(err)).toBe('Recurso no encontrado.')
  })

  it('returns server error for 500', () => {
    const err = { response: { status: 500 } }
    expect(getErrorMessage(err)).toBe('Error interno del servidor.')
  })

  it('returns generic message for unexpected errors', () => {
    const err = {}
    expect(getErrorMessage(err)).toBe('Error inesperado. Intenta nuevamente.')
  })

  it('returns JSON stringified data for 400 with data', () => {
    const err = { response: { status: 400, data: { campo: 'email', mensaje: 'inválido' } } }
    expect(getErrorMessage(err)).toBe(JSON.stringify(err.response.data))
  })

  it('returns default message for 400 without data', () => {
    const err = { response: { status: 400 } }
    expect(getErrorMessage(err)).toBe('Solicitud inválida.')
  })
})
