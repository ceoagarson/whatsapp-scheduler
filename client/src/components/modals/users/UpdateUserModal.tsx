import { useContext } from 'react'
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext'
import { IUser } from '../../../types/user.type'
import { Modal } from 'react-bootstrap'
import UpdateUserForm from '../../forms/users/UpdateUserForm'

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