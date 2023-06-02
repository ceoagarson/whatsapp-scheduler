import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import UsersPage from "./pages/UsersPage"
import TasksPage from "./pages/TasksPage"
import MessagesPage from "./pages/MessagesPage"
import SignUpPage from "./pages/auth/SignUpPage"
import { useContext } from "react"
import { UserContext } from "./contexts/UserContext"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import UpdatePasswordPage from "./pages/auth/UpdatePassword"
import RecordsPage from "./pages/RecordsPage"

export enum paths {
    login = "/login",
    reset_password = "/password/reset/:token",
    update_password = "/password/update",
    users = "/users",
    signup = "/signup",
    tasks = "/tasks",
    messages = "/messages",
    records = "/records"
}
function AppRoutes() {
    const { user } = useContext(UserContext)
    return (
        <Routes>
            <Route path={paths.login} element={<LoginPage />} />
            <Route path={paths.signup} element={<SignUpPage />} />
            <Route path={paths.reset_password} element={<ResetPasswordPage />} />
            <Route path={paths.users} element={user ? <UsersPage /> : <LoginPage />} />
            <Route path={paths.records} element={user ? <RecordsPage /> : <LoginPage />} />
            <Route path={paths.tasks} element={user ? <TasksPage /> : <LoginPage />} />
            <Route path={paths.messages} element={user ? <MessagesPage /> : <LoginPage />} />
            <Route path={paths.update_password} element={user ? <UpdatePasswordPage /> : <LoginPage />} />
            <Route path="*" element={<Navigate to={paths.login} />} />
        </Routes>
    )
}

export default AppRoutes

