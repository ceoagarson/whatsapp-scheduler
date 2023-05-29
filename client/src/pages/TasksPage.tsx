import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../types'
import { Button, Container, Modal } from 'react-bootstrap'
import { ChoiceContext, TaskChoiceActions, } from '../contexts/DialogContext'
import AddTaskModel from '../components/modals/tasks/AddTaskModel'
import { ITask } from '../types/task.type'
import { GetTasks } from '../services/TaskServices'
import styled from 'styled-components'
import moment from "moment";

const StyledTable = styled.table`
 {
  border-collapse: collapse;
  width: 100%;
}

 td,  th {
  padding:5px;
  border: 1px solid #ddd;
  min-width:230px;
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
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<ITask[]>, BackendError>("tasks", GetTasks, {
    refetchOnMount: true
  })
  const { setChoice } = useContext(ChoiceContext)
  const [tasks, setTasks] = useState<ITask[]>([])

  // setup tasks
  useEffect(() => {
    if (isSuccess)
      setTasks(data.data)
  }, [isSuccess, data])

  return (
    <>
      {
        isLoading ? <h1 className="fs-6">Loading tasks ...</h1>
          :
          <>
            <AddTaskModel />
            <Container className='d-flex justify-content-end p-2'>
              <Button variant="outline-primary" onClick={() => {
                setChoice({ type: TaskChoiceActions.new_task })
              }}>Add Task</Button>
            </Container>
            <div className="w-100 overflow-auto d-flex">
              <StyledTable>
                <thead>
                  <tr className="text-uppercase">
                    <th>Task Title</th>
                    <th>Task Description</th>
                    <th>Phone</th>
                    <th>Start date</th>
                    <th>Next Run Date</th>
                    <th>Next Refresh Date</th>

                    <th>Minutes</th>
                    <th>Hours</th>
                    <th>Days</th>
                    <th>Months</th>
                    <th>Week days</th>
                    <th>Month days</th>

                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Created By</th>
                    <th>Updated By</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks && tasks.map((task, index) => {
                    return (
                      <tr key={index}>
                        <td>{task.task_title}</td>
                        <td>{task.task_detail}</td>
                        <td>{task.phone}</td>
                        <td>{moment(new Date(task.start_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                        <td>{moment(new Date(task.next_run_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                        <td>{moment(new Date(task.next_refresh_date)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                        <td>{task.frequency && task.frequency.minutes ? task.frequency.minutes : 0}</td>
                        <td>{task.frequency && task.frequency.hours ? task.frequency.hours : 0}</td>
                        <td>{task.frequency && task.frequency.days ? task.frequency.days : 0}</td>
                        <td>{task.frequency && task.frequency.months ? task.frequency.months : 0}</td>
                        <td>{task.frequency && task.frequency.weekdays ? task.frequency.weekdays : 0}</td>
                        <td>{task.frequency && task.frequency.monthdays ? task.frequency.monthdays : 0}</td>
                        <td>{moment(new Date(task.created_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                        <td>{moment(new Date(task.updated_at)).format('MMMM Do YYYY, h:mm:ss a')}</td>
                        <td>{task.created_by.username}</td>
                        <td>{task.updated_by.username}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </StyledTable>
            </div>
          </>
      }
    </>
  )

}