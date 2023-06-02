import { useQuery } from "react-query";
import AppRoutes from "./Routes";
import NavBar from "./components/navbar/NavBar";
import { GetRecords } from "./services/MessageServices";
import { AxiosResponse } from "axios";
import { IRecord } from "./types/Record";
import { BackendError } from "./types";
import { useEffect, useState } from "react";

function App() {
  const { data, isSuccess } = useQuery<AxiosResponse<IRecord[]>, BackendError>("records", GetRecords, {
    refetchOnMount: true
  })
  const [records, setRecords] = useState<IRecord[]>([])
  useEffect(() => {
    if (isSuccess)
      setRecords(data.data)
  }, [isSuccess, data])
  console.log(records)
  return (
    <>
      <NavBar />
      <AppRoutes />
    </>
  )
}

export default App