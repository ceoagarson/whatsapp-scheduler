import { AxiosResponse } from 'axios'
import { useContext, useEffect } from 'react'
import { BackendError } from '../../../types'
import { useMutation } from 'react-query'
import { MessageChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { queryClient } from '../../..'
import {  Button, Container, Modal } from 'react-bootstrap'
import { IMessage } from '../../../types/messages.type'
import { StartSingleMessageScheduler } from '../../../services/MessageServices'
import AlertBar from '../../alert/AlertBar'

function StartMessageModal({ message }: { message: IMessage }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate,  isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (StartSingleMessageScheduler,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('messages')

                }
            }
        )
    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: MessageChoiceActions.close })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <Modal
            show={choice === MessageChoiceActions.start_message ? true : false}
            onHide={() => setChoice({ type: MessageChoiceActions.close })}
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
                      <AlertBar message="Successfully started" variant="success"
                    />
                   
                ) : null
            }
            <Container className='p-2'>
                <p className="tetx-center d-block fs-6 fw-bold text-capitalize p-2">Confirm To start message having title "{message.message_image}</p>
                <Container className="d-flex w-100 jusify-content-center align-items-center gap-2">

                    <Button variant="outline-danger" className="w-100"
                        onClick={() => {
                            mutate(message._id)
                            setChoice({ type: MessageChoiceActions.close })
                        }
                        }
                    >Yes</Button>
                    <Button variant="primary" className="w-100"
                        onClick={() => setChoice({ type: MessageChoiceActions.close })}
                    >NO</Button>
                </Container>
            </Container>
        </Modal>
    )
}

export default StartMessageModal