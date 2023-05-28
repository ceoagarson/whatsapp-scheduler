import { AxiosResponse } from 'axios'
import { useContext, useEffect } from 'react'
import { IUser } from '../../types/user.type'
import { BackendError } from '../../types'
import { Signup } from '../../services/UserServices'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { UserContext } from '../../contexts/UserContext'
import { useFormik } from 'formik'
import * as Yup from "yup"
import { Container, Form } from 'react-bootstrap'
import Button from "react-bootstrap/Button"
import { paths } from '../../Routes'
import Alert from 'react-bootstrap/Alert';

function SignUpPage() {
  const goto = useNavigate()
  const { mutate, data, isSuccess, isLoading, isError, error } = useMutation
    <AxiosResponse<IUser>,
      BackendError,
      { username: string, mobile: number, email: string, password: string }
    >(Signup)

  const { setUser } = useContext(UserContext)

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      mobile: 7056943283,
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, 'Must be 4 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required(),
      email: Yup.string()
        .email()
        .required(),
      mobile: Yup.string()
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits')
        .required(),
      password: Yup.string()
        .min(6, 'Must be 6 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required()
    }),
    onSubmit: (values: {
      username: string,
      password: string,
      mobile: number,
      email: string
    }) => {
      mutate(values)
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setUser(data.data)
        goto(paths.users)
      }, 2000)
    }
  }, [setUser, goto, isSuccess, data])

  return (
    <Container className='d-flex  fluid justify-content-center min-vh-100 min-vw-100'>
      <Form onSubmit={formik.handleSubmit} className='shadow  p-4 bg-body-tertiary rounded bg-light align-self-center'>
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
              Successfully registered
            </Alert>
          ) : null
        }
        <Form.Group className="pt-3 mb-3" >
          <Form.Control type="username" placeholder="Username or Email"
            {...formik.getFieldProps('username')}
          />
          <Form.Text className='text-muted'>{formik.touched.username && formik.errors.username ? formik.errors.username : ""}</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Control type="email" placeholder="Email"
            {...formik.getFieldProps('email')}
          />
          <Form.Text className='text-muted'>{formik.touched.email && formik.errors.email ? formik.errors.email : ""}</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Control type="number" placeholder="Mobile "
            {...formik.getFieldProps('mobile')}
          />
          <Form.Text className='text-muted'>{formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""}</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Control type="password" placeholder="Password"
            {...formik.getFieldProps('password')}
          />
          <Form.Text className='text-muted'>{formik.touched.password && formik.errors.password ? formik.errors.password : ""}</Form.Text>
        </Form.Group>

        <Button variant="primary" className='w-100' type="submit"
          disabled={isLoading}
        >{isLoading ? "Working on it..." : "Register"}</Button>
        <p className='text-dark  text-center d-block p-2 fw-light text-muted text-lowercase'>Already Have a Account
          <Link className="text-decoration-none p-1" to={paths.login} ><b>Login</b></Link></p>
      </Form>
    </Container>
  )
}

export default SignUpPage