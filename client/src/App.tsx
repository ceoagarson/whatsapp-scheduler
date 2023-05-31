import AppRoutes from "./Routes";
import AlertBar from "./components/alert/AlertBar";
import NavBar from "./components/navbar/NavBar";

function App() {
  return (
    <>
    <AlertBar message="hello world" variant="danger"/>
      <NavBar/>
      <AppRoutes />
    </>
  )
}

export default App