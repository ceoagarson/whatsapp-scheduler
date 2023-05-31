import { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import { MessageChoiceActions, ChoiceContext } from '../../../contexts/DialogContext';
import UpdateMessageForm from '../../forms/messages/UpdateMessageForm';
import { IMessage } from '../../../types/messages.type';

export default function UpdateMessageModal({ message }: { message: IMessage }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === MessageChoiceActions.edit_message ? true : false}
            onHide={() => setChoice({ type: MessageChoiceActions.close })}
            centered
        >
            <UpdateMessageForm message={message} />
        </Modal>
    );
}