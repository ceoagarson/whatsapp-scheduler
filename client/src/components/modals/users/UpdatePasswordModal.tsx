import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { IUser } from '../../../types/user.type'
import { Modal } from 'react-bootstrap'
import UpdatePasswordForm from '../../forms/users/UpdatePasswordForm'

function UpdatePasswordModal() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === AppChoiceActions.update_password ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close })}
            centered
        >
            <UpdatePasswordForm/>
        </Modal>
    )
}

export default UpdatePasswordModal