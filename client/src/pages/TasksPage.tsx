import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../types'
import { Button, Container } from 'react-bootstrap'
import { ChoiceContext, TaskChoiceActions, } from '../contexts/DialogContext'
import { ITask } from '../types/task.type'
import { GetTasks } from '../services/TaskServices'
import styled from 'styled-components'
import moment from "moment";
import StartTaskSchedulerButton from '../components/buttons/StartTaskSchedulerButton'
import StopSchedulerButton from '../components/buttons/StopSchedulerButton'
import DeleteTaskModal from '../components/modals/tasks/DeleteTaskModal'
import AddTaskModal from '../components/modals/tasks/AddTaskModal'
import UpdateTaskModal from '../components/modals/tasks/UpdateTaskModal'

const StyledTable = styled.table`
 {
  border-collapse: collapse;
  width: 100%;
  font-size:12px;
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
export default function TasksPage() {
  const { setChoice } = useContext(ChoiceContext)
  const [tasks, setTasks] = useState<ITask[]>([])
  const [task, setTask] = useState<ITask>()

  const { data, isSuccess } = useQuery<AxiosResponse<ITask[]>, BackendError>("tasks", GetTasks, {
    refetchOnMount: true
  })
  function setSelectedTask(tasks: ITask[], id: string) {
    let task = tasks.find((task) => task._id === id)
    if (task) setTask(task)
  }

  // setup tasks
  useEffect(() => {
    if (isSuccess)
      setTasks(data.data)
  }, [isSuccess, data, tasks])
  return (
    <>
      <AddTaskModal />
      {task ?
        <>
          <UpdateTaskModal task={task} />
          <DeleteTaskModal task={task} />
        </>
        : null}
      <Container className='d-flex justify-content-end p-2 gap-2'>
        <Button variant="primary" onClick={() => {
          setChoice({ type: TaskChoiceActions.new_task })
        }}>Add Task</Button>
        <StartTaskSchedulerButton />
        <StopSchedulerButton />
      </Container>
      <div className="w-100 overflow-auto d-flex">
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
                  <td>{task.running_trigger ? "running" : "stopped"}</td>
                  <td>{task.whatsapp_status}</td>
                  <td>{moment(new Date(String(task.whatsapp_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{task.task_status}</td>
                  <td>{moment(new Date(String(task.task_timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</td>

                  <td>{task.task_title}</td>
                  <td>{task.task_detail}</td>
                  <td>{task.phone}</td>
                  <td>{moment(new Date(task.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(new Date(task.next_run_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(new Date(task.next_refresh_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{task.frequency && task.frequency.frequencyType ? task.frequency.frequencyType : ""}</td>
                  <td>{task.frequency && task.frequency.frequency ? task.frequency.frequency : 0}</td>
                  <td>{moment(new Date(task.created_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{moment(new Date(task.updated_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>{task.created_by.username}</td>
                  <td>{task.updated_by.username}</td>
                  <td>
                    {/* update task */}
                    <img style={{ "cursor": "pointer" }} title="edit"
                      onClick={() => {
                        setSelectedTask(tasks, task._id)
                        setChoice({ type: TaskChoiceActions.edit_task })
                      }
                      }
                      width="18" height="18" src="https://img.icons8.com/dusk/64/edit--v1.png" alt="edit--v1" />
                    {/* delete task */}
                    <img style={{ "cursor": "pointer" }} title="delete"
                      onClick={() => {
                        setSelectedTask(tasks, task._id)
                        setChoice({ type: TaskChoiceActions.delete_task })
                      }
                      }
                      width="20" height="20" src="https://img.icons8.com/plasticine/100/filled-trash.png" alt="edit--v1" />
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