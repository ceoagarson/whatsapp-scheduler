import React, { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import { AppChoiceActions, ChoiceContext } from '../../contexts/DialogContext';
import NewUserForm from '../forms/NewUserForm';

export default function AddUserModel() {
    const { choice, setChoice } = useContext(ChoiceContext)
    console.log(choice)
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