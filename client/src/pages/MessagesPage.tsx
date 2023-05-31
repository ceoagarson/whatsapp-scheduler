import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../types'
import { Button, Container } from 'react-bootstrap'
import { ChoiceContext, MessageChoiceActions, } from '../contexts/DialogContext'
import { IMessage } from '../types/messages.type'
import { GetMessages } from '../services/MessageServices'
import styled from 'styled-components'
import moment from "moment";
import StartMessageSchedulerButton from '../components/buttons/StartMessageSchedulerButton'
import StopSchedulerButton from '../components/buttons/StopTaskSchedulerButton'
import DeleteMessageModal from '../components/modals/messages/DeleteMessageModal'
import AddMessageModal from '../components/modals/messages/AddMessageModal'
import UpdateMessageModal from '../components/modals/messages/UpdateMessageModal'
import StartMessageModal from '../components/modals/messages/StartMessageModal'
import StopMessageModal from '../components/modals/messages/StopMessageModal'

const StyledTable = styled.table`
 {
  border-collapse: collapse;
  width: 100%;
}

 td,  th {
  white-space: nowrap;
  overflow: hidden;
  padding:5px;
  border: 1px solid #ddd;
  min-width:180px;
  max-height:20px;
  
}
td:hover{
  white-space: normal;
  overflow: auto;  
}

 tr:nth-child(even){background-color: #f2f2f2;}

 tr:hover {background-color: #ddd;}

 th {
  text-align: left;
  background-color:blue;
  color: white;
}
`
export default function MessagesPage() {
  const { setChoice } = useContext(ChoiceContext)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [message, setMessage] = useState<IMessage>()

  const { data, isSuccess } = useQuery<AxiosResponse<IMessage[]>, BackendError>("messages", GetMessages, {
    refetchOnMount: true
  })
  function setSelectedMessage(messages: IMessage[], id: string) {
    let message = messages.find((message) => message._id === id)
    if (message) setMessage(message)
  }

  // setup messages
  useEffect(() => {
    if (isSuccess)
      setMessages(data.data)
  }, [isSuccess, data, messages])
  return (
    <>
      <AddMessageModal />
      {message ?
        <>
          <UpdateMessageModal message={message} />
          <DeleteMessageModal message={message} />
          <StartMessageModal message={message} />
          <StopMessageModal message={message} />
        </>
        : null}
      <Container className='d-flex justify-content-end p-2 gap-2'>
        <Button variant="primary" onClick={() => {
          setChoice({ type: MessageChoiceActions.new_message })
        }}>
          <img className="m-1" src="https://img.icons8.com/stickers/100/message-completed--v2.png"alt="icon" height="30" width="30" />

          Add Message</Button>
        {/* modals */}
        <StartMessageSchedulerButton />
        <StopSchedulerButton />

      </Container>
      <div className="w-100 overflow-auto d-flex">
        <StyledTable>
          <thead>
            <tr className="text-uppercase">
              <th>Scheduler</th>
              <th>Whatsapp Status</th>
              <th>Whatsapp Timestamp</th>
              <th>Message Status</th>
              <th>Message TimeStamp</th>
              <th className='.text-nowrap'>Message Title</th>
              <th>Message Description</th>
              <th>Phone</th>
              <th>Start date</th>
              <th>Next Run Date</th>
              <th>Next Refresh Date</th>

              <th>Frequency Type</th>
              <th>Frequency</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Created By</th>
              <th>Updated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages && messages.map((message, index) => {
              return (
                <tr key={index}>
                  <td>{!message.autoStop || message.run_once ? "running" : "stopped"}</td>
                  <td>{message.whatsapp_status}</td>
                  <td>{moment(new Date(String(message.whatsapp_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{message.message_status}</td>
                  <td>{moment(new Date(String(message.message_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td><img src={message.message_image} alt="icon" height="30" width="30"/></td>
                  <td>{message.message_detail}</td>
                  <td>{message.phone}</td>
                  <td>{moment(new Date(message.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(new Date(message.next_run_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(new Date(message.next_refresh_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{message.frequency && message.frequency.frequencyType ? message.frequency.frequencyType : ""}</td>
                  <td>{message.frequency && message.frequency.frequency ? message.frequency.frequency : 0}</td>
                  <td>{moment(new Date(message.created_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(new Date(message.updated_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{message.created_by.username}</td>
                  <td>{message.updated_by.username}</td>
                  <td>
                    {/* update message */}
                    <img style={{ "cursor": "pointer" }} title="edit"
                      onClick={() => {
                        setSelectedMessage(messages, message._id)
                        setChoice({ type: MessageChoiceActions.edit_message })
                      }
                      }
                      width="18" height="18" src="https://img.icons8.com/dusk/64/edit--v1.png" alt="edit--v1" />
                    {/* start and stop message scheduler */}
                    {
                      message.autoStop ?
                        <img style={{ "cursor": "pointer" }} title="Start"
                          onClick={() => {
                            setSelectedMessage(messages, message._id)
                            setChoice({ type: MessageChoiceActions.start_message })
                          }
                          }
                          width="20" height="20" src="https://img.icons8.com/color/48/restart--v1.png" alt="edit--v1" /> :
                        <img style={{ "cursor": "pointer" }} title="Stop"
                          onClick={() => {
                            setSelectedMessage(messages, message._id)
                            setChoice({ type: MessageChoiceActions.stop_message })
                          }
                          }
                          width="20" height="20" src="https://img.icons8.com/color/48/stop--v1.png" alt="edit--v1" />
                    }
                    {/* delete message */}
                    <img style={{ "cursor": "pointer" }} title="delete"
                      onClick={() => {
                        setSelectedMessage(messages, message._id)
                        setChoice({ type: MessageChoiceActions.delete_message })
                      }
                      }
                      width="24" height="24" src="https://img.icons8.com/plasticine/100/filled-trash.png" alt="edit--v1" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </StyledTable>
      </div>
    </>
  )
}