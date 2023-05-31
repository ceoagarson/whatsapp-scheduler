import  { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import { MessageChoiceActions, ChoiceContext } from '../../../contexts/DialogContext';
import NewMessageForm from '../../forms/messages/NewMessageForm';

export default function AddMessageModal() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === MessageChoiceActions.new_message ? true : false}
            onHide={() => setChoice({ type: MessageChoiceActions.close })}
            centered
        >
            <NewMessageForm />
        </Modal>
    );
}