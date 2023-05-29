import React, { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import { AppChoiceActions, ChoiceContext } from '../../../contexts/DialogContext';
import NewUserForm from '../../forms/users/NewUserForm';

export default function AddUserModel() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === AppChoiceActions.new_user ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close })}
            centered
        >
            <NewUserForm />
        </Modal>
    );
}