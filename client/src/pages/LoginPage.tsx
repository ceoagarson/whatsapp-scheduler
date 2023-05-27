import { AxiosResponse } from 'axios'
import { useContext, useEffect } from 'react'
import { IUser } from '../types/user.type'
import { BackendError } from '../types'
import { Login } from '../services/UserServices'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Form } from 'react-bootstrap'
import Button from "react-bootstrap/Button"
import { paths } from '../Routes'
import Alert from 'react-bootstrap/Alert';

function LoginPage() {
  const goto = useNavigate()
  const { mutate, data, isSuccess, isLoading, isError, error } = useMutation
    <AxiosResponse<IUser>,
      BackendError,
      { username: string, password: string }
    >(Login)

  const { setUser } = useContext(UserContext)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, 'Must be 4 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required(),
      password: Yup.string()
        .min(6, 'Must be 6 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required()
    }),
    onSubmit: (values: {
      username: string,
      password: string
    }) => {
      mutate(values)
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setUser(data.data)
        goto(paths.users)
      }, 400)
    }
  }, [setUser, goto, isSuccess, data])

  return (
    <Form onSubmit={formik.handleSubmit} className='p-2'>
      {
        isError ? (
          <Alert variant="danger">
            {error?.response.data.message}
          </Alert>

        ) : null
      }
      {
        isSuccess ? (
          <Alert color="success">
            logged in
          </Alert>
        ) : null
      }
      <Form.Group className="mb-3" >
        <Form.Control type="username" placeholder="username or email"
          {...formik.getFieldProps('username')}
        />
      </Form.Group>
      <Form.Group className="mb-3" >
        <Form.Control type="password" placeholder="password"
          {...formik.getFieldProps('password')}
        />
      </Form.Group>
      <Button variant="outline-primary" size="lg" className='w-100' type="submit"
        disabled={isLoading}
      >{isLoading ? "Logging in..." : "Login"}</Button>
    </Form>
  )
}

export default LoginPage