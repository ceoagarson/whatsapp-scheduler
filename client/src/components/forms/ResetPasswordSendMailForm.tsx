import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { UserContext } from '../../contexts/UserContext';
import { BackendError } from '../../types';
import { ResetPasswordSendMail } from '../../services/UserServices';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { paths } from '../../Routes';


function ResetPasswordSendMailForm() {
    const goto = useNavigate()
    const { user } = useContext(UserContext)

    const { mutate, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<string>,
            BackendError,
            { email: string }
        >
        (ResetPasswordSendMail)

    const formik = useFormik({
        initialValues: {
            email: user?.email || ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email()
                .required('Required field')
        }),
        onSubmit: (values: {
            email: string
        }) => {
            mutate(values)
        },
    });
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                goto(paths.login)
            }, 1000)
        }
    }, [goto, isSuccess])
    return (
        <Container className='d-flex  fluid justify-content-center h-100 min-vw-100'>
            <Form onSubmit={formik.handleSubmit} className='shadow mt-5  p-3 bg-body-tertiary border border-2 rounded bg-light align-self-center'>
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
                            Successful
                        </Alert>
                    ) : null
                }
                <Form.Group className="mb-3" >
                    <Form.Control className="border border-primary" type="email" placeholder="email address"
                        {...formik.getFieldProps('email')}
                    />
                    <Form.Text className='pl-2 text-muted'>{formik.touched.email && formik.errors.email ? formik.errors.email : ""}</Form.Text>
                </Form.Group>
                <Button variant="primary" className='w-100' type="submit"
                    disabled={isLoading}
                >{isLoading ? "Working on it..." : "Send Password Reset Link"}</Button>
            </Form>
        </Container>
    )
}

export default ResetPasswordSendMailForm