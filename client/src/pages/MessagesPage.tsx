import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../types'
import { Button,  Form } from 'react-bootstrap'
import { ChoiceContext, MessageChoiceActions, } from '../contexts/DialogContext'
import { IMessage } from '../types/messages.type'
import { GetMessages } from '../services/MessageServices'
import styled from 'styled-components'
import moment from "moment";
import StartMessageSchedulerButton from '../components/buttons/StartMessageSchedulerButton'
import StopSchedulerButton from '../components/buttons/StopMessageSchedulerButton'
import DeleteMessageModal from '../components/modals/messages/DeleteMessageModal'
import AddMessageModal from '../components/modals/messages/AddMessageModal'
import UpdateMessageModal from '../components/modals/messages/UpdateMessageModal'
import StartMessageModal from '../components/modals/messages/StartMessageModal'
import StopMessageModal from '../components/modals/messages/StopMessageModal'
import FuzzySearch from "fuzzy-search"
import ViewMessageModal from '../components/modals/messages/ViewMessageModal'
import { UserContext } from '../contexts/UserContext'

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
  max-width:180px;
  max-height:20px;
  font-size:12px;
  
}


 tr:nth-child(even){background-color: #f2f2f2;}
 tr:nth-child(odd){background-color: #ddd;}

 tr:hover {background-color: lightgrey;}

 th {
  text-align: left;
  background-color:blue;
  color: white;
}
`
export default function MessagesPage() {
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [message, setMessage] = useState<IMessage>()
  const [filter, setFilter] = useState<string | undefined>()
  const [preFilteredData, setPreFilteredData] = useState<IMessage[]>([])
  const { data, isSuccess } = useQuery<AxiosResponse<IMessage[]>, BackendError>("messages", GetMessages, {
    refetchOnMount: true
  })
  function setSelectedMessage(messages: IMessage[], id: string) {
    let message = messages.find((message) => message._id === id)
    if (message) setMessage(message)
  }

  useEffect(() => {
    if (isSuccess) {
      setMessages(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, data])

  //set filter
  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(messages, ["autoRefresh", "autoStop", "created_at", "created_by.username", "frequency.frequency", "frequency.frequencyType", "message_image","messsage", "message_status", "message_timestamp", "next_refresh_date", "next_run_date", "person",  "phone", "start_date", "updated_at", "whatsapp_status", "updated_by.username", "whatsapp_timestamp"], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setMessages(result)
    }
    if (!filter)
      setMessages(preFilteredData)
  }, [filter, preFilteredData, messages])

  return (
    <>
      <AddMessageModal />
      {message ?
        <>
          <UpdateMessageModal message={message} />
          <DeleteMessageModal message={message} />
          <StartMessageModal message={message} />
          <StopMessageModal message={message} />
          <ViewMessageModal message={message}/>
        </>
        : null}
      <div className='d-flex flex-column flex-md-row justify-content-between  align-items-center  p-2 gap-2'>
        <div>
          <Form.Control
            className="border border-primary"
            placeholder={`${messages && messages.length} messages`}
            type="search"
            onChange={(e) => setFilter(e.currentTarget
              .value)}
          />
        </div>

        <div className="d-flex justify-content-center  align-items-center  p-2 gap-2 ">
          <Button variant="primary" onClick={() => {
            setChoice({ type: MessageChoiceActions.new_message })
          }}>
            <img className="m-1" src="https://img.icons8.com/color/48/whatsapp--v1.png" height="30" width="30" alt="icon" />

            Add Message</Button>
          {/* modals */}
          <StartMessageSchedulerButton />
          <StopSchedulerButton />
        </div>


      </div>
      <div className="w-100 overflow-auto d-flex">
        <StyledTable>
          <thead>
            <tr className="text-uppercase">
              <th>Scheduler</th>
              <th>Whatsapp Status</th>
              <th>Whatsapp Timestamp</th>
              <th>Message Status</th>
              <th>Message TimeStamp</th>
              <th className='.text-nowrap'>Message Image</th>
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
                  <td><img src={message.message_image} alt="icon" height="30" width="30" /></td>
                  <td>{message.message_detail}</td>
                  <td>{message.phone}</td>
                  {new Date(message.start_date) <= new Date() ?

                    <td style={{ "color": "red" }}>{moment(new Date(message.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                    :
                    <td>{moment(new Date(message.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  }
                  <td>{
                    moment(message.next_run_date).format('MMMM Do YYYY, h:mm:ss a')

                  }</td>
                  <td>{
                   moment(message.next_refresh_date).format('MMMM Do YYYY, h:mm:ss a')

                  }</td>
                  <td>{message.frequency && message.frequency.frequencyType ? message.frequency.frequencyType : ""}</td>
                  <td>{message.frequency && message.frequency.frequency ? message.frequency.frequency : 0}</td>
                  <td>{moment(new Date(message.created_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(new Date(message.updated_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{message.created_by.username}</td>
                  <td>{message.updated_by.username}</td>
                  <td>
                    {
                      user?.is_admin ?
                        <>
                          {/* update message */}
                          <img style={{ "cursor": "pointer" }} title="edit"
                            onClick={() => {
                              setSelectedMessage(messages, message._id)
                              setChoice({ type: MessageChoiceActions.edit_message })
                            }
                            }
                            width="18" height="18" src="https://img.icons8.com/dusk/64/edit--v1.png" alt="edit--v1" />
                          {/* view message */}
                          <img style={{ "cursor": "pointer" }} title="edit"
                            onClick={() => {
                              setSelectedMessage(messages, message._id)
                              setChoice({ type: MessageChoiceActions.view_message })
                            }
                            }
                            width="18" height="18" src="https://img.icons8.com/emoji/48/eye-emoji.png" alt="edit--v1" />


                          {/* start and stop message scheduler */}
                          {
                            message.autoStop ?
                              <img style={{ "cursor": "pointer" }} title="Restart"
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
                        </>
                        : <img style={{ "cursor": "pointer" }} title="edit"
                          onClick={() => {
                            setSelectedMessage(messages, message._id)
                            setChoice({ type: MessageChoiceActions.view_message })
                          }
                          }
                          width="18" height="18" src="https://img.icons8.com/emoji/48/eye-emoji.png" alt="edit--v1" />

                    }
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
