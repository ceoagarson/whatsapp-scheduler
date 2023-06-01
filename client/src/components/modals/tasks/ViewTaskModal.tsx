import Modal from 'react-bootstrap/Modal';
import { ITask } from '../../../types/task.type';
import moment from "moment";
import styled from 'styled-components';
import { ChoiceContext, TaskChoiceActions } from '../../../contexts/DialogContext';
import { useContext } from 'react';

const StyledDiv = styled.div` 
span{
    font-weight:bold
}

`


export default function ViewTaskModal({ task }: { task: ITask }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === TaskChoiceActions.view_task ? true : false}
            onHide={() => setChoice({ type: TaskChoiceActions.close })}
            centered
        >
            <StyledDiv className='d-flex-column p-2 bg-light justify-content-left gap-1'>
                <p><span>Scheduler : </span>{!task.autoStop || task.run_once ? "running" : "stopped"}</p>
                <p><span>Whatsapp Status :</span> {task.whatsapp_status}</p>
                <p><span>Whatsapp Timestamp : </span>{moment(new Date(String(task.whatsapp_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Task Status: </span>{task.task_status}</p>
                <p><span>Task TimeStamp:</span> {moment(new Date(String(task.task_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</p>

                <p><span>Task Title : </span>{task.task_title}</p>
                <p><span>Task Description : </span>{task.task_detail}</p>
                <p><span>Phone : </span>{task.phone}</p>
                {new Date(task.start_date) <= new Date() ?

                    <p style={{ "color": "red" }}><span>Start date :</span>{moment(new Date(task.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                    :
                    <p><span>Start date : </span>{moment(new Date(task.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                }
                <p><span>Next Run Date : </span>{moment(new Date(task.next_run_date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Next Refresh Date :</span> {moment(new Date(task.next_refresh_date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Frequency Type : </span>{task.frequency && task.frequency.frequencyType ? task.frequency.frequencyType : ""}</p>
                <p><span>Frequency : </span>{task.frequency && task.frequency.frequency ? task.frequency.frequency : 0}</p>
                <p><span>Created At : </span>{moment(new Date(task.created_at)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Updated At :</span> {moment(new Date(task.updated_at)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Created By : </span>{task.created_by.username}</p>
                <p><span>Updated By : </span>{task.updated_by.username}</p>
            </StyledDiv>
        </Modal>
    );
}