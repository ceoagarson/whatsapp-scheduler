import { UserContext } from "./contexts/UserContext"
import { useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import UsersPage from "./pages/UsersPage"
import TasksPage from "./pages/TasksPage"
import GreetingPage from "./pages/GreetingPage"
import SignUpPage from "./pages/SignUpPage"

export enum paths {
    login = "/login",
    users = "/users",
    signup = "signup",
    tasks = "/tasks",
    greetings = "/greetings"
}
function AppRoutes() {
    const { user } = useContext(UserContext)
    return (
        <Routes>
            <>
                {
                    !user ?
                        <>
                            <Route path={paths.login} element={<LoginPage />} />
                            <Route path={paths.signup} element={<SignUpPage />} />
                            <Route path="*" element={<Navigate to={paths.login} />} />
                        </>
                        :
                        <>
                            <Route path={paths.users} element={<UsersPage />} />
                            <Route path={paths.tasks} element={<TasksPage />} />
                            <Route path={paths.greetings} element={<GreetingPage />
                            } />
                        </>
                }
            </>
        </Routes>
    )
}

export default AppRoutes

