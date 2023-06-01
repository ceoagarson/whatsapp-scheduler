import Modal from 'react-bootstrap/Modal';
import { IMessage } from '../../../types/messages.type';
import moment from "moment";
import styled from 'styled-components';
import { ChoiceContext, MessageChoiceActions } from '../../../contexts/DialogContext';
import { useContext } from 'react';

const StyledDiv = styled.div` 
span{
    font-weight:bold
}

`


export default function ViewMessageModal({ message }: { message: IMessage }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Modal
            show={choice === MessageChoiceActions.view_message ? true : false}
            onHide={() => setChoice({ type: MessageChoiceActions.close })}
            centered
        >
            <StyledDiv className='d-flex-column p-2 bg-light justify-content-left gap-1'>
                <p><span>Scheduler : </span>{!message.autoStop || message.run_once ? "running" : "stopped"}</p>
                <p><span>Whatsapp Status :</span> {message.whatsapp_status}</p>
                <p><span>Whatsapp Timestamp : </span>{moment(new Date(String(message.whatsapp_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Message Status: </span>{message.message_status}</p>
                <p><span>Message TimeStamp:</span> {moment(new Date(String(message.message_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</p>

                <span>Message Image : </span><img src={message.message_image} alt="icon" height="30" width="30" />
                <p><span>Message Description : </span>{message.message_detail}</p>
                <p><span>Phone : </span>{message.phone}</p>
                {new Date(message.start_date) <= new Date() ?

                    <p style={{ "color": "red" }}><span>Start date :</span>{moment(new Date(message.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                    :
                    <p><span>Start date : </span>{moment(new Date(message.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                }
                <p><span>Next Run Date : </span>{moment(new Date(message.next_run_date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Next Refresh Date :</span> {moment(new Date(message.next_refresh_date)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Frequency Type : </span>{message.frequency && message.frequency.frequencyType ? message.frequency.frequencyType : ""}</p>
                <p><span>Frequency : </span>{message.frequency && message.frequency.frequency ? message.frequency.frequency : 0}</p>
                <p><span>Created At : </span>{moment(new Date(message.created_at)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Updated At :</span> {moment(new Date(message.updated_at)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Created By : </span>{message.created_by.username}</p>
                <p><span>Updated By : </span>{message.updated_by.username}</p>
            </StyledDiv>
        </Modal>
    );
}