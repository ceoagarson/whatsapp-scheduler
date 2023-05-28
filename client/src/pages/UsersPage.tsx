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
import UpdateUserModel from '../components/modals/UpdateUserModal'
import DeleteUserModel from '../components/modals/DeleteUserModel'

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
export default function UsersPage() {
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<IUser[]>, BackendError>("users", GetUsers, {
    refetchOnMount: true
  })
  const { setChoice } = useContext(ChoiceContext)
  const [user, setUser] = useState<IUser>()
  const [users, setUsers] = useState<IUser[]>([])

  function setSelectedUser(users: IUser[], id: string) {
    let user = users.find((user) => user._id === id)
    if (user) setUser(user)
  }
  // setup users
  useEffect(() => {
    if (isSuccess)
      setUsers(data.data)
  }, [isSuccess, data])

  return (
    <>
      {
        isLoading ? <h1 className="fs-6">Loading users ...</h1>
          :
          <>
            <Container className='d-flex justify-content-end p-2'>
              <Button variant="outline-primary" onClick={() => {
                setChoice({ type: AppChoiceActions.new_user })
              }}>Add User</Button>
              <AddUserModel />
              {user ?
                <>
                  <UpdateUserModel user={user} />
                  <DeleteUserModel user={user} />
                </> : null
              }
            </Container>
            <div className="w-100 overflow-auto d-flex">
              <StyledTable>
                <thead>
                  <tr className="text-uppercase">
                    <th>Username</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Created At</th>
                    <th>Created By</th>
                    <th>Actions</th>
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
                        <td>{user.is_active ? "active" : "blocked"}</td>
                        <td>{new Date(user.last_login).toLocaleString()}</td>
                        <td>{new Date(user.last_login).toLocaleString()}</td>
                        <td>{user.created_by.username}</td>
                        <td className="d-flex gap-2">
                          {/* update user */}
                          <img style={{ "cursor": "pointer" }} title="edit"
                            onClick={() => {
                              setSelectedUser(users, user._id)
                              setChoice({ type: AppChoiceActions.update_user })
                            }
                            }
                            width="24" height="24" src="https://img.icons8.com/dusk/64/edit--v1.png" alt="edit--v1" />

                          {/* block and unblock user */}
                          {user.is_active ?
                            <img style={{ "cursor": "pointer" }} title="block"
                              onClick={() => {
                                setSelectedUser(users, user._id)
                                setChoice({ type: AppChoiceActions.block_user })
                              }
                              }
                              width="24" height="24" src="https://img.icons8.com/ios-filled/24/cancel-2.png" alt="cancel-2" /> :
                            <img style={{ "cursor": "pointer" }} title="unblock"
                              onClick={() => {
                                setSelectedUser(users, user._id)
                                setChoice({ type: AppChoiceActions.unblock_user })
                              }
                              }
                              width="24" height="24" src="https://img.icons8.com/external-tal-revivo-filled-tal-revivo/24/external-unlock-security-lock-with-permission-granted-to-access-login-filled-tal-revivo.png" alt="edit--v1" />
                          }

                          {
                            user.is_admin ?
                              <img style={{ "cursor": "pointer" }} title="make admin"
                                onClick={() => {
                                  setSelectedUser(users, user._id)
                                  setChoice({ type: AppChoiceActions.remove_admin })
                                }
                                }
                                width="24" height="24" src="https://img.icons8.com/fluency/100/administrator-male.png"
                                alt="cross-mark-button-emoji" /> :
                              <img style={{ "cursor": "pointer" }} title="remove admin"
                                onClick={() => {
                                  setSelectedUser(users, user._id)
                                  setChoice({ type: AppChoiceActions.make_admin })
                                }
                                }

                                width="24" height="24" src="https://img.icons8.com/emoji/48/cross-mark-button-emoji.png" alt="administrator-male" />
                          }
                          <img style={{ "cursor": "pointer" }} title="delete"
                            onClick={() => {
                              setSelectedUser(users, user._id)
                              setChoice({ type: AppChoiceActions.delete_user })
                            }
                            }
                            width="24" height="24" src="https://img.icons8.com/color/48/delete-forever.png" alt="delete--v1" />
                        </td>
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