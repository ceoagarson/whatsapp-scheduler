import { AxiosResponse } from 'axios';
import React, {  useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { BackendError } from '../../types';
import { useFormik } from 'formik';
import { paths } from '../../Routes';
import { UpdatePassword } from '../../services/UserServices';


function UpdatePasswordPage() {
  const goto = useNavigate()
  const { mutate, isLoading, isSuccess, isError, error } = useMutation
    <AxiosResponse<string>,
      BackendError,
    { oldPassword: string, newPassword: string, confirmPassword:string }
    >
    (UpdatePassword)

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .min(6, 'Must be 6 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required field'),
      newPassword: Yup.string()
        .min(6, 'Must be 6 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required field')
    }),
    onSubmit: (values: {
      oldPassword: string,
      newPassword: string,
      confirmPassword:string
    }) => {
      let body = values
      mutate(body)
    },
  });


  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        goto(paths.users)
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
          <Form.Control className="border border-primary" type="password" placeholder="old password"
            {...formik.getFieldProps('oldPassword')}
          />
          <Form.Text className='pl-2 text-muted'>{formik.touched.oldPassword && formik.errors.oldPassword ? formik.errors.oldPassword : ""}</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Control className="border border-primary" type="password" placeholder="new password"
            {...formik.getFieldProps('newPassword')}
          />
          <Form.Text className='pl-2 text-muted'>{formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : ""}</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" >
          <Form.Control className="border border-primary" type="password" placeholder="confirm password"
            {...formik.getFieldProps('confirmPassword')}
          />
          <Form.Text className='pl-2 text-muted'>{formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ""}</Form.Text>
        </Form.Group>
        <Button variant="primary" className='w-100' type="submit"
          disabled={isLoading}
        >{isLoading ? "Working on it..." : "Update Password"}</Button>
      </Form>
    </Container>
  )
}

export default UpdatePasswordPage