import { useContext, useEffect } from 'react'
import { useMutation } from 'react-query'
import { Logout } from '../../services/UserServices'
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
        <img
            onClick={() => {
                mutate()
                setUser(undefined)
            }}
            height="20"
            className='bg-danger p-1 rounded border border-light'
            width="20"
            style={{ "cursor": "pointer" }}
            src="https://img.icons8.com/ios/50/exit--v1.png" />
    )

}

export default LogoutButton