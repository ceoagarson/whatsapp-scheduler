import { AxiosResponse } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { GetUsers } from '../services/UserServices'
import { BackendError } from '../types'
import { IUser } from '../types/user.type'
import { Button, Container, Modal } from 'react-bootstrap'
import AddUserModel from '../components/modals/AddUserModel'
import { AppChoiceActions, ChoiceContext } from '../contexts/DialogContext'
import styled from "styled-components"

const StyledTable = styled.table`
 {
  border-collapse: collapse;
  width: 100%;
}

 td,  th {
  padding:5px;
  border: 1px solid #ddd;
  min-width:200px;
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
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers, {
    refetchOnMount: true
  })
  const { setChoice } = useContext(ChoiceContext)
  const [users, setUsers] = useState<IUser[]>([])

  // setup users
  useEffect(() => {
    if (isSuccess)
      setUsers(data.data)
  }, [isSuccess, data])

  return (
    <>
      {
        isLoading ? <h1 className="fs-6">Loading messages ...</h1>
          :
          <>
            <Container className='d-flex justify-content-end p-2'>
              <Button variant="outline-primary" onClick={() => {
                setChoice({ type: AppChoiceActions.new_message })
              }}>New Message</Button>
              <AddUserModel />
            </Container>
            <div className="w-100 overflow-auto d-flex">
              <StyledTable>
                <thead>
                  <tr className="text-uppercase">
                    <th>Username</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Last Login</th>
                    <th>Created At</th>
                    <th>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.map((user, index) => {
                    return (
                      <tr key={index}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.is_admin ? "admin" : "user"}</td>
                        <td>{new Date(user.last_login).toLocaleString()}</td>
                        <td>{new Date(user.last_login).toLocaleString()}</td>
                        <td>{user.created_by.username}</td>
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