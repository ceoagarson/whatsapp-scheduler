import { AxiosResponse } from 'axios'
import { IMessage } from '../../types/messages.type'
import { BackendError } from '../../types'
import { StartMessageScheduler } from '../../services/MessageServices'
import { useMutation } from 'react-query'
import { queryClient } from '../..'
import { Button } from 'react-bootstrap'
import AlertBar from '../alert/AlertBar'

function StartMessageSchedulerButton() {
    const { mutate: Start_scheduler, isSuccess, isLoading, isError, error } = useMutation
        <AxiosResponse<IMessage>,
            BackendError
        >(StartMessageScheduler, {
            onSuccess: () => {
                queryClient.invalidateQueries('messages')
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
                    <AlertBar message='Successfully started' variant="success"
                    />
                ) : null
            }
            <Button  variant="outline-success" size="sm" onClick={() => {
                Start_scheduler()
            }}>
                <img className="m-1"  src="https://img.icons8.com/color/48/restart--v1.png" height="24" width="24"/>
                Start Scheduler</Button>
        </>
    )
}

export default StartMessageSchedulerButton