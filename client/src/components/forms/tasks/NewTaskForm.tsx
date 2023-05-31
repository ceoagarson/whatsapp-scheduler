import { AxiosResponse } from 'axios'
import { useState } from 'react'
import { useMutation } from 'react-query'
import * as Yup from "yup"
import { Alert, Form } from 'react-bootstrap'
import Button from "react-bootstrap/Button"
import { IFrequency, ITask } from '../../../types/task.type'
import { NewTask } from '../../../services/TaskServices'
import { BackendError } from '../../../types'
import { useFormik } from 'formik'
import moment from 'moment'
import { queryClient } from '../../..'
import AlertBar from '../../alert/AlertBar'

function NewTaskForm() {
    const [displayFreq, setDisplayFreq] = useState(false)
    const { mutate, data, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<ITask>,
            BackendError,
            {
                task_title: string,
                task_detail: string,
                person: string,
                phone: number,
                start_date: string,
                frequency?: IFrequency
            }
        >(NewTask, {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
            }
        })
    const formik = useFormik({
        initialValues: {
            task_title: "",
            task_detail: "",
            person: "",
            phone: 0,
            start_date: moment(new Date((new Date().getTime() + 60000))).format("YYYY-MM-DDThh:mm"),
            frequencyValue: "",
            frequencyType: ""
        },
        validationSchema: Yup.object({
            task_title: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .max(50, 'Must be 500 characters or less')
                .required(),
            task_detail: Yup.string()
                .min(10, 'Must be 10 characters or more')
                .max(500, 'Must be 500 characters or less')
                .required(),
            person: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .max(30, 'Must be 30 characters or less')
                .required(),
            phone: Yup.string()
                .min(12, 'Must be 10 digits with country code')
                .max(12, 'Must be 10 digits with country code')
                .required(),
            frequencyValue: Yup.string()
                .test("required", (data) => {
                    if (displayFreq && !data)
                        return false
                    else
                        return true
                }),
            frequencyType: Yup.string()
                .test("required", (data) => {
                    if (displayFreq && !data)
                        return false
                    else
                        return true
                }),
            start_date: Yup.date().test("date could not be in the past", (data) => {
                if (data && new Date(data) < new Date())
                    return false
                else
                    return true
            })
        }),
        onSubmit: (values: {
            task_title: string,
            task_detail: string,
            person: string,
            phone: number,
            start_date: string,
            frequencyValue?: string,
            frequencyType?: string
        }) => {
            if (values.frequencyValue && values.frequencyType) {
                mutate({
                    ...values,
                    frequency: {
                        type: "task",
                        frequency: values.frequencyValue,
                        frequencyType: values.frequencyType
                    }
                })
            }
            else
                mutate(values)

        },
    });

    return (
        <Form onSubmit={formik.handleSubmit} className='p-4 shadow w-100 bg-body-tertiary border border-2 rounded bg-light align-self-center'>
            <h1 className="d-block fs-4 text-center">New task Form</h1>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} variant="danger"
                    />

                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message='Successfull' variant="success"
                    />
                ) : null
            }
            {/* task title */}
            <Form.Group className="pt-3 mb-3" >
                <Form.Control className="border border-primary" placeholder="Task Title"
                    {...formik.getFieldProps('task_title')}
                />
                <Form.Text className='text-muted'>{formik.touched.task_title && formik.errors.task_title ? formik.errors.task_title : ""}</Form.Text>
            </Form.Group>
            {/* task detail */}
            <Form.Group className="mb-3" >
                <Form.Control className="border border-primary" placeholder="Task"
                    {...formik.getFieldProps('task_detail')}
                />
                <Form.Text className='text-muted'>{formik.touched.task_detail && formik.errors.task_detail ? formik.errors.task_detail : ""}</Form.Text>
            </Form.Group>
            {/* person */}
            <Form.Group className="mb-3" >
                <Form.Control className="border border-primary" placeholder="Person"
                    {...formik.getFieldProps('person')}
                />
                <Form.Text className='text-muted'>{formik.touched.person && formik.errors.person ? formik.errors.person : ""}</Form.Text>
            </Form.Group>
            {/* phone */}
            <Form.Group className="mb-3" >
                <Form.Control className="border border-primary" type="number" placeholder="Phone "
                    {...formik.getFieldProps('phone')}
                />
                <Form.Text className='text-muted'>{formik.touched.phone && formik.errors.phone ? formik.errors.phone : ""}</Form.Text>
            </Form.Group>
            {/* date */}
            <Form.Group className="mb-3" >
                <Form.Control className="border border-primary" type="datetime-local" placeholder="Start Date "
                    {...formik.getFieldProps('start_date')}
                />
                <Form.Text className='text-muted'>{formik.touched.start_date && formik.errors.start_date ? formik.errors.start_date : ""}</Form.Text>
            </Form.Group>
            {/* switch */}
            <Form.Group className="mb-3" >
                <Form.Check
                    type="switch"
                    label="frequency"
                    onChange={() => setDisplayFreq(!displayFreq)}
                />
            </Form.Group>

            {displayFreq ?
                <div className='w-100 d-flex justify-content-between align-items-center gap-2'>
                    <Form.Group className="mb-3">
                        <Form.Select
                            {...formik.getFieldProps('frequencyType')}
                        >
                            <option value="">Select Frequency</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="months">Months</option>
                            <option value="weekdays">Weekdays</option>
                            <option value="monthdays">MonthDays</option>
                        </Form.Select>
                        <Form.Text className='text-muted'>{formik.touched.frequencyType && formik.errors.frequencyType ? formik.errors.frequencyType : ""}</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control className="border border-primary"
                            {...formik.getFieldProps('frequencyValue')}
                        />
                        <Form.Text className='text-muted'>{formik.touched.frequencyValue && formik.errors.frequencyValue ? formik.errors.frequencyValue : ""}</Form.Text>
                    </Form.Group>

                </div>

                : null
            }
            <Button variant="primary" className='w-100' type="submit"
                disabled={isLoading}
            >{isLoading ? "Working on it..." : "Create Task"}</Button>
        </Form >
    )
}

export default NewTaskForm