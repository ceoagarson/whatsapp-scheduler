import { Button } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { ITask } from '../../types/task.type'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../types'
import { StopTaskScheduler } from '../../services/TaskServices'
import { queryClient } from '../..'
import AlertBar from '../alert/AlertBar'

function StopTaskSchedulerButton() {

    const { mutate: Stop_Scheduler, isSuccess, isLoading, isError, error } = useMutation
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
                    <AlertBar message='Successfull stopped' variant="success"
                    />
                ) : null
            }
            <Button size="sm"  variant="outline-danger" onClick={() => {
                Stop_Scheduler()
            }}>
                <img className="m-1" src="https://img.icons8.com/color/48/stop--v1.png" height="30" width="30" />
                Stop Scheduler</Button>
        </>
    )
}

export default StopTaskSchedulerButton