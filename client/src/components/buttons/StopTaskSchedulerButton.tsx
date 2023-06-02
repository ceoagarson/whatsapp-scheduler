import { Button } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { ITask } from '../../types/task.type'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../types'
import { StopTaskScheduler } from '../../services/TaskServices'
import { queryClient } from '../..'
import AlertBar from '../alert/AlertBar'

function StopTaskSchedulerButton() {

    const { mutate: Stop_Scheduler, isSuccess, isError, error } = useMutation
        <AxiosResponse<ITask>,
            BackendError
        >(StopTaskScheduler, {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks')
            }
        })
    return (
        <>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} variant="danger"
                    />

                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message='Successfull stopped' variant="danger"
                    />
                ) : null
            }
            <Button size="sm" variant="danger" onClick={() => {
                Stop_Scheduler()
            }}>
                <img className="m-1" src="https://img.icons8.com/color/48/stop--v1.png" height="30" width="30" alt="icon" />
                <span className='d-none d-md-inline-block'>
                    Stop Task Scheduler
                </span>
            </Button>
        </>
    )
}

export default StopTaskSchedulerButton
