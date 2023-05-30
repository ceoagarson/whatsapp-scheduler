import  { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import { TaskChoiceActions, ChoiceContext } from '../../../contexts/DialogContext';
import NewTaskForm from '../../forms/tasks/NewTaskForm';

export default function AddTaskModal() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === TaskChoiceActions.new_task ? true : false}
            onHide={() => setChoice({ type: TaskChoiceActions.close })}
            centered
        >
            <NewTaskForm />
        </Modal>
    );
}