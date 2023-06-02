import { Button } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { IMessage } from '../../types/messages.type'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../types'
import { StopMessageScheduler } from '../../services/MessageServices'
import { queryClient } from '../..'
import AlertBar from '../alert/AlertBar'

function StopMessageSchedulerButton() {

    const { mutate: Stop_Scheduler, isSuccess,  isError, error } = useMutation
        <AxiosResponse<IMessage>,
            BackendError
        >(StopMessageScheduler, {
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
                Stop Messages Scheduler</Button>
        </>
    )
}

export default StopMessageSchedulerButton
