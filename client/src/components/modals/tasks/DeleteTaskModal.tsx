import { AxiosResponse } from 'axios'
import { useContext, useEffect } from 'react'
import { BackendError } from '../../../types'
import { useMutation } from 'react-query'
import { TaskChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { queryClient } from '../../..'
import {  Button, Container, Modal } from 'react-bootstrap'
import { DeleteTask } from '../../../services/TaskServices'
import { ITask } from '../../../types/task.type'
import AlertBar from '../../alert/AlertBar'

function DeleteTaskModal({ task }: { task: ITask }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate,  isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteTask,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('tasks')

                }
            }
        )
    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: TaskChoiceActions.close })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <Modal
            show={choice === TaskChoiceActions.delete_task ? true : false}
            onHide={() => setChoice({ type: TaskChoiceActions.close })}
            centered
        >
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} variant="danger"
                    />

                ) : null
            }
            {
                isSuccess ? (
                  
                      <AlertBar message="Successfully deleted" variant="danger"
                    />
                ) : null
            }
           <Container className='p-2'>
                <p className="tetx-center d-block fs-6 fw-bold text-capitalize p-2">Confirm To delete task having title "{task.task_title}</p>
                <Container className="d-flex w-100 jusify-content-center align-items-center gap-2">

                    <Button variant="outline-danger"className="w-100" 
                        onClick={() => {
                            mutate(task._id)
                            setChoice({ type: TaskChoiceActions.close })
                        }
                        }
                    >Yes</Button>
                    <Button variant="primary" className="w-100" 
                        onClick={() => setChoice({ type: TaskChoiceActions.close })}
                    >NO</Button>
                </Container>
           </Container>
        </Modal>
    )
}

export default DeleteTaskModal