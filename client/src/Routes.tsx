import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import UsersPage from "./pages/UsersPage"
import TasksPage from "./pages/TasksPage"
import GreetingPage from "./pages/GreetingPage"
import SignUpPage from "./pages/SignUpPage"
import { useContext } from "react"
import { UserContext } from "./contexts/UserContext"

export enum paths {
    login = "/",
    users = "/users",
    signup = "signup",
    tasks = "/tasks",
    greetings = "/greetings"
}
function AppRoutes() {
    const {user}=useContext(UserContext)
    return (
        <Routes>
            <Route path={paths.login} element={<LoginPage />} />
            <Route path={paths.signup} element={<SignUpPage />} />
            <Route path={paths.users} element={user&& <UsersPage />} />
            <Route path={paths.tasks} element={user&& <TasksPage />} />
            <Route path={paths.greetings} element={user&& <GreetingPage />
            } />
            <Route path="*" element={<Navigate to={paths.login} />} />
        </Routes>
    )
}

export default AppRoutes

