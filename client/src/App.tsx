import { useQuery } from "react-query";
import AppRoutes from "./Routes";
import NavBar from "./components/navbar/NavBar";
import { GetRecord } from "./services/MessageServices";
import { AxiosResponse } from "axios";
import { IRecord } from "./types/Record";
import { BackendError } from "./types";
import { useEffect, useState } from "react";

function App() {
  const [phone, setPhone] = useState(917056943283)
  const { data, isSuccess, refetch, isLoading } = useQuery<AxiosResponse<IRecord[]>, BackendError>(["records", phone], () => GetRecord(phone), {
    refetchOnMount: true
  })
  const [records, setRecords] = useState<IRecord[]>([])
  useEffect(() => {
    if (isSuccess)
      setRecords(data.data)
    if (phone) {
      refetch()
    }
  }, [isSuccess, data, phone])
  console.log(records)
  return (
    <>
      <NavBar />
      <AppRoutes />
    </>
  )
}

export default App