import  { useContext } from 'react'
import { Alert,  Modal } from 'react-bootstrap'
import { AppChoiceActions, ChoiceContext } from '../../contexts/DialogContext'
import UpdateUserForm from '../forms/UpdateUserForm'
import { IUser } from '../../types/user.type'

function UpdateUserModel({ user }: { user: IUser }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === AppChoiceActions.update_user ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close })}
            centered
        >
            <UpdateUserForm user={user} />
        </Modal>
    )
}

export default UpdateUserModel