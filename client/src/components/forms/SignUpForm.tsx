import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
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

function SignUpForm() {
    const goto = useNavigate()
    const { mutate, data, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IUser>,
            BackendError,
            { username: string, mobile: number, email: string, password: string }
        >(Signup)
    const [display, setDisplay] = useState<string | undefined>()
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
                goto(paths.dashboard)
            }, 2000)
        }
    }, [setUser, goto, isSuccess, data])

    return (
        <>
            <Container className='d-flex  fluid justify-content-center h-100 min-vw-100'>
                <Form onSubmit={formik.handleSubmit} className='shadow mt-5  p-3 bg-body-tertiary border border-2 rounded bg-light align-self-center'>
                    <h1 className="d-block fs-4 text-center">Signup Form</h1>

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
                    {display ? <Alert color="success">
                        {display}
                    </Alert> : null}
                    <Form.Group className="pt-3 mb-3" >
                        <Form.Control className="border border-primary" type="username" placeholder="Username or Email"
                            {...formik.getFieldProps('username')}
                        />
                        <Form.Text className='text-muted'>{formik.touched.username && formik.errors.username ? formik.errors.username : ""}</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Control className="border border-primary" type="email" placeholder="Email"
                            {...formik.getFieldProps('email')}
                            onClick={() => setDisplay("Provide corrcet email address otherwise not able to reset password in future if forgot ?")}
                        />
                        <Form.Text className='text-muted'>{formik.touched.email && formik.errors.email ? formik.errors.email : ""}</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Control className="border border-primary" type="number" placeholder="Mobile "
                            {...formik.getFieldProps('mobile')}
                        />
                        <Form.Text className='text-muted'>{formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""}</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Control className="border border-primary" type="password" placeholder="Password"
                            {...formik.getFieldProps('password')}
                        />
                        <Form.Text className='text-muted'>{formik.touched.password && formik.errors.password ? formik.errors.password : ""}</Form.Text>
                    </Form.Group>

                    <Button variant="primary" className='w-100' type="submit"
                        disabled={isLoading}
                    >{isLoading ? "Working on it..." : "Register"}</Button>
                    <p className='text-dark  text-center d-block p-2 fw-light text-muted'>Already have an account
                        <Link className="text-decoration-none p-1" to={paths.login} ><b>Login</b></Link></p>
                    <Link className="d-block text-decoration-none text-center pt-3" to={paths.reset_password} >forgot password ?</Link>
                </Form>
            </Container>
            <p className="text-capitalize position-relative w-100 bottom-0 mt-4 p-2 bg-primary text-light text-center">Copyright @ Agarson shoes pvt. ltd.</p>
        </>
    )
}

export default SignUpForm