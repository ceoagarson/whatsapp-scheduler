import { AxiosResponse } from 'axios'
import  { useContext, useEffect } from 'react'
import {  Button, Container, Modal } from 'react-bootstrap'
import { BackendError } from '../../../types'
import { useMutation } from 'react-query'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { IUser } from '../../../types/user.type'
import { queryClient } from '../../..'
import { BlockUser } from '../../../services/UserServices'
import AlertBar from '../../alert/AlertBar'


function BlockUserModel({ user }: { user: IUser }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate,  isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (BlockUser,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('users')

                }
            }
        )

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: AppChoiceActions.close })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <Modal
            show={choice === AppChoiceActions.block_user ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close })}
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
                    <AlertBar message="Successful" variant="success"
                    />
                    
                ) : null
            }
           <Container className='p-2'>
                <p className="tetx-center d-block fs-6 fw-bold text-capitalize p-2">Confirm To Block "{user.username}"</p>
                <Container className="d-flex w-100 jusify-content-center align-items-center gap-2">

                    <Button variant="outline-danger"className="w-100" 
                        onClick={() => {
                            mutate(user._id)
                            setChoice({ type: AppChoiceActions.close })
                        }
                        }
                    >Yes</Button>
                    <Button variant="primary" className="w-100" 
                        onClick={() => setChoice({ type: AppChoiceActions.close })}
                    >NO</Button>
                </Container>
           </Container>
        </Modal>
    )
}

export default BlockUserModel