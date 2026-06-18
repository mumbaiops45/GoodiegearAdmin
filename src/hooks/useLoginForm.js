'use client'

import { useState, useCallback } from 'react'

const INITIAL = { email: '', password: '' }

function validate({ email, password }) {
  const errors = {}
  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }
  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  return errors
}

export function useLoginForm(onSubmit) {
  const [fields, setFields] = useState(INITIAL)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))
      const errors = validate(fields)
      if (errors[name]) setFieldErrors((prev) => ({ ...prev, [name]: errors[name] }))
    },
    [fields]
  )

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const errors = validate(fields)
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        setTouched({ email: true, password: true })
        return
      }
      await onSubmit(fields)
    },
    [fields, onSubmit]
  )

  const reset = useCallback(() => {
    setFields(INITIAL)
    setFieldErrors({})
    setTouched({})
  }, [])

  return { fields, fieldErrors, touched, handleChange, handleBlur, handleSubmit, reset }
}
