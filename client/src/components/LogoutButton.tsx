import  { useEffect } from 'react'
import { useMutation } from 'react-query'
import { Logout } from '../services/UserServices'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { paths } from '../Routes'

function LogoutButton() {
    const goto = useNavigate()
    const { mutate, isSuccess } = useMutation(Logout)
    useEffect(() => {
        if (isSuccess) {
            goto(paths.login)
        }
    }, [goto, isSuccess])
    return (
        <Button variant="outline-danger" size="lg" className='w-100' type="submit"
            onClick={() => mutate()}
        >Logout</Button>
    )
}

export default LogoutButton