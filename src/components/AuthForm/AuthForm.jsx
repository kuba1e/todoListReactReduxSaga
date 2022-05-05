import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import PropTypes from 'prop-types'
import * as yup from 'yup'

import './AuthForm.scss'

import { todosSelector } from '../../store/selectors'

export const AuthForm = ({ onSubmit, btnLabel }) => {
  const { isAuth, error } = useSelector(todosSelector)
  const dispatch = useDispatch()

  const handleSubmit = useCallback(({ email, password }, { resetForm }) => {
    dispatch(
      onSubmit({
        email,
        password
      })
    )
    resetForm({
      values: {
        email: '',
        password: ''
      }
    })
  }, [])

  const initialValues = {
    email: '',
    password: ''
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Please, enter the correct email')
      .required('Please enter the email'),
    password: yup
      .string()
      .matches(
        /^([a-zA-Z]+|\d+){6}$/,
        'Please, enter the password longer then 6 symbols'
      )
      .required('Please, enter the password')
  })

  if (isAuth) {
    return <Navigate to='/' replace />
  }

  return (
    <div className='auth'>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({
          values: { email, password },
          errors,
          touched,
          handleChange,
          handleBlur
        }) => (
          <Form className='auth__form'>
            <div className='auth__container'>
              <label className='auth__form-label' htmlFor='email'>
                Email
              </label>
              <input
                className={`auth__form-input ${
                  errors.email && touched.email ? 'auth__form-input--error' : ''
                }`}
                name='email'
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className='auth__form-input-helper'>
                {errors.email && touched.email ? errors.email : ''}
              </p>
            </div>
            <div className='auth__container'>
              <label className='auth__form-label' htmlFor='password'>
                Password
              </label>
              <input
                className={`auth__form-input ${
                  errors.password && touched.password
                    ? 'auth__form-input--error'
                    : ''
                }`}
                name='password'
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                type='password'
              />
              <p className='auth__form-input-helper'>
                {errors.password && touched.password ? errors.password : ''}
                {error ? 'Password or email is wrong' : ''}
              </p>
            </div>
            <button className='auth__form-sbmt-btn'>{btnLabel}</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

AuthForm.propTypes = {
  onSubmit: PropTypes.func,
  btnLabel: PropTypes.string
}