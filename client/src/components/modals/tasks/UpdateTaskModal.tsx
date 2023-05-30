import { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import { TaskChoiceActions, ChoiceContext } from '../../../contexts/DialogContext';
import UpdateTaskForm from '../../forms/tasks/UpdateTaskForm';
import { ITask } from '../../../types/task.type';

export default function UpdateTaskModal({ task }: { task: ITask }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === TaskChoiceActions.edit_task ? true : false}
            onHide={() => setChoice({ type: TaskChoiceActions.close })}
            centered
        >
            <UpdateTaskForm task={task} />
        </Modal>
    );
}