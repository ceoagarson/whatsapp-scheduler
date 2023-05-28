import { useContext, useEffect } from 'react'
import { useMutation } from 'react-query'
import { Logout } from '../../services/UserServices'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../Routes'
import { UserContext } from '../../contexts/UserContext'

function LogoutButton() {
    const goto = useNavigate()
    const { setUser } = useContext(UserContext)
    const { mutate, isSuccess } = useMutation(Logout)
    useEffect(() => {
        if (isSuccess) {
            goto(paths.login)
        }
    }, [goto, isSuccess])
    return (
        <Button variant="d-block outline-danger" type="submit"
            onClick={() => {
                mutate()
                setUser(undefined)
            }}
        >Logout</Button>
    )
}

export default LogoutButton