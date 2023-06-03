import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../types'
import { Button, Form } from 'react-bootstrap'
import { ChoiceContext, TaskChoiceActions, } from '../contexts/DialogContext'
import { ITask } from '../types/task.type'
import { GetTasks } from '../services/TaskServices'
import styled from 'styled-components'
import moment from "moment";
import StartTaskSchedulerButton from '../components/buttons/StartTaskSchedulerButton'
import StopSchedulerButton from '../components/buttons/StopTaskSchedulerButton'
import DeleteTaskModal from '../components/modals/tasks/DeleteTaskModal'
import AddTaskModal from '../components/modals/tasks/AddTaskModal'
import UpdateTaskModal from '../components/modals/tasks/UpdateTaskModal'
import StartTaskModal from '../components/modals/tasks/StartTaskModal'
import StopTaskModal from '../components/modals/tasks/StopTaskModal'
import FuzzySearch from "fuzzy-search"
import ViewTaskModal from '../components/modals/tasks/ViewTaskModal'
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
export default function TasksPage() {
  const { setChoice } = useContext(ChoiceContext)
  const { user } = useContext(UserContext)
  const [tasks, setTasks] = useState<ITask[]>([])
  const [task, setTask] = useState<ITask>()
  const [filter, setFilter] = useState<string | undefined>()
  const [preFilteredData, setPreFilteredData] = useState<ITask[]>([])
  const { data, isSuccess } = useQuery<AxiosResponse<ITask[]>, BackendError>("tasks", GetTasks, {
    refetchOnMount: true
  })
  function setSelectedTask(tasks: ITask[], id: string) {
    let task = tasks.find((task) => task._id === id)
    if (task) setTask(task)
  }

  //setup tasks
  useEffect(() => {
    if (isSuccess) {
      setTasks(data.data)
      setPreFilteredData(data.data)
    }
  }, [isSuccess, data])

  //set filter
  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(tasks, ["autoRefresh", "autoStop", "created_at", "created_by.username", "frequency.frequency", "frequency.frequencyType", "task_title", "task_detail", "task_status", "task_timestamp", "next_refresh_date", "next_run_date", "person", "phone", "start_date", "updated_at", "whatsapp_status", "updated_by.username", "whatsapp_timestamp"], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setTasks(result)
    }
    if (!filter)
      setTasks(preFilteredData)
  }, [filter, preFilteredData, tasks])
  return (
    <>
      <AddTaskModal />
      {task ?
        <>
          {
            user?.is_admin ?
              <>
                <UpdateTaskModal task={task} />
                <DeleteTaskModal task={task} />
                <StartTaskModal task={task} />
                <StopTaskModal task={task} />
              </>
              : null
          }
          <ViewTaskModal task={task} />
        </>
        : null}
      <div className='d-flex flex-column flex-md-row justify-content-between  align-items-center  p-2 gap-2'>
        <div>
          <Form.Control
            className="border border-primary"
            placeholder={`${tasks && tasks.length} tasks`}
            type="search"
            onChange={(e) => setFilter(e.currentTarget
              .value)}
          />
        </div>

        <div className="d-flex justify-content-center  align-items-center  p-2 gap-2 ">
          <Button variant="primary" onClick={() => {
            setChoice({ type: TaskChoiceActions.new_task })
          }}>
            <img className="m-1" src="https://img.icons8.com/stickers/100/task-completed--v2.png" height="30" width="30" alt="icon" />

            Add Task</Button>
          {/* modals */}
          <StartTaskSchedulerButton />
          <StopSchedulerButton />
        </div>


      </div>
      <div className="w-100  overflow-auto d-flex">
        <StyledTable>
          <thead>
            <tr className="text-uppercase">
              <th>Scheduler</th>
              <th>Whatsapp Status</th>
              <th>Whatsapp Timestamp</th>
              <th>Task Status</th>
              <th>Task TimeStamp</th>
              <th className='.text-nowrap'>Task Title</th>
              <th>Task Description</th>
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
            {tasks && tasks.map((task, index) => {
              return (
                <tr key={index}>
                  <td>{!task.autoStop || task.run_once ? "running" : "stopped"}</td>
                  <td>{task.whatsapp_status}</td>
                  <td>{moment(new Date(String(task.whatsapp_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{task.task_status}</td>
                  <td>{moment(new Date(String(task.task_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</td>

                  <td>{task.task_title}</td>
                  <td>{task.task_detail}</td>
                  <td>{task.phone}</td>
                  {new Date(task.start_date) <= new Date() ?

                    <td style={{ "color": "red" }}>{moment(new Date(task.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                    :
                    <td>{moment(new Date(task.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  }
                  <td>{task.frequency && task.frequency.frequencyType === "months" ? moment(new Date(task.next_run_date.setMonth(task.next_run_date.getMonth() - 1))).format('MMMM Do YYYY, h:mm:ss a') : moment(task.next_run_date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{task.frequency && task.frequency.frequencyType === "months" ? moment(new Date(task.next_refresh_date.setMonth(task.next_refresh_date.getMonth() - 1))).format('MMMM Do YYYY, h:mm:ss a') : moment(task.next_refresh_date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{task.frequency && task.frequency.frequencyType ? task.frequency.frequencyType : ""}</td>
                  <td>{task.frequency && task.frequency.frequency ? task.frequency.frequency : 0}</td>
                  <td>{moment(new Date(task.created_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(new Date(task.updated_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{task.created_by.username}</td>
                  <td>{task.updated_by.username}</td>
                  <td>
                    {
                      user?.is_admin ?
                        <>
                          {/* update task */}
                          <img style={{ "cursor": "pointer" }} title="edit"
                            onClick={() => {
                              setSelectedTask(tasks, task._id)
                              setChoice({ type: TaskChoiceActions.edit_task })
                            }
                            }
                            width="18" height="18" src="https://img.icons8.com/dusk/64/edit--v1.png" alt="edit--v1" />
                          {/* view task */}
                          <img style={{ "cursor": "pointer" }} title="edit"
                            onClick={() => {
                              setSelectedTask(tasks, task._id)
                              setChoice({ type: TaskChoiceActions.view_task })
                            }
                            }
                            width="18" height="18" src="https://img.icons8.com/emoji/48/eye-emoji.png" alt="edit--v1" />


                          {/* start and stop task scheduler */}
                          {
                            task.autoStop ?
                              <img style={{ "cursor": "pointer" }} title="Restart"
                                onClick={() => {
                                  setSelectedTask(tasks, task._id)
                                  setChoice({ type: TaskChoiceActions.start_task })
                                }
                                }
                                width="20" height="20" src="https://img.icons8.com/color/48/restart--v1.png" alt="edit--v1" /> :
                              <img style={{ "cursor": "pointer" }} title="Stop"
                                onClick={() => {
                                  setSelectedTask(tasks, task._id)
                                  setChoice({ type: TaskChoiceActions.stop_task })
                                }
                                }
                                width="20" height="20" src="https://img.icons8.com/color/48/stop--v1.png" alt="edit--v1" />
                          }
                          {/* delete task */}
                          <img style={{ "cursor": "pointer" }} title="delete"
                            onClick={() => {
                              setSelectedTask(tasks, task._id)
                              setChoice({ type: TaskChoiceActions.delete_task })
                            }
                            }
                            width="24" height="24" src="https://img.icons8.com/plasticine/100/filled-trash.png" alt="edit--v1" />
                        </>
                        : <img style={{ "cursor": "pointer" }} title="edit"
                          onClick={() => {
                            setSelectedTask(tasks, task._id)
                            setChoice({ type: TaskChoiceActions.view_task })
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
