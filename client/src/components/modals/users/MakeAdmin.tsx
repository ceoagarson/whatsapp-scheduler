import { AxiosResponse } from 'axios'
import { useContext, useEffect } from 'react'
import { BackendError } from '../../../types'
import { useMutation } from 'react-query'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { IUser } from '../../../types/user.type'
import { queryClient } from '../../..'
import { MakeAdmin } from '../../../services/UserServices'
import {  Button, Container, Modal } from 'react-bootstrap'
import AlertBar from '../../alert/AlertBar'

function MakeAdminModal({ user }: { user: IUser }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate,  isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (MakeAdmin,
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
            show={choice === AppChoiceActions.make_admin ? true : false}
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
                <p className="tetx-center d-block fs-6 fw-bold text-capitalize p-2">Confirm To Make Admin to "{user.username}"</p>
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

export default MakeAdminModal