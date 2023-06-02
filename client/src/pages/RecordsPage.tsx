import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { IRecord } from '../types/Record'
import { BackendError } from '../types'
import { GetRecord, GetRecords } from '../services/MessageServices'
import { Button, Container, Form } from 'react-bootstrap'
import styled from 'styled-components'
import moment from 'moment'

const StyledTable = styled.table`
 {
  border-collapse: collapse;
  width: 100%;
}

 td,  th {
  white-space: nowrap;
  overflow: hidden;
  padding:5px;
  border: 1px solid #ddd;
  min-width:180px;
  max-height:20px;
  font-size:12px;
  
}


 tr:nth-child(even){background-color: #f2f2f2;}
 tr:nth-child(odd){background-color: #ddd;}

 tr:hover {background-color: lightgrey;}
 th {
  text-align: left;
  background-color:blue;
  color: white;
}
`

function RecordsPage() {
    const [phone, setPhone] = useState<number | undefined>()
    const [records, setRecords] = useState<IRecord[]>([])

    const { data, refetch, isSuccess, isLoading } = useQuery<AxiosResponse<IRecord[]>, BackendError>(["records", phone], () => GetRecord(phone), {
        enabled: false
    })

    const { data: DATA } = useQuery<AxiosResponse<IRecord[]>, BackendError>("records", GetRecords, {
        refetchOnMount: true,
        onSuccess(data) {
            setRecords(data.data)
        },
    })

    useEffect(() => {
        if (isSuccess && phone && data)
            setRecords(data.data)

    }, [isSuccess, phone, data])

    return (
        <>
            <Form className='w-100 d-flex justify-content-center align-items-center gap-2 p-2'>
                <img width="30" height="30" src="https://img.icons8.com/color/48/search--v1.png" alt="search--v1" />
                <Form.Control
                    className="border border-primary"
                    placeholder={`${records && records.length ? `${records.length} records` : "Phone"}`}
                    type="search"
                    onChange={(e) => setPhone(Number(e.currentTarget
                        .value))}

                />
            </Form>
            <div className="d-flex-column w-100 overflow-auto">

                <>
                    {
                        isLoading ?
                            <p>loading chats....</p>
                            :
                            <>
                                <StyledTable>
                                    <thead>
                                        <tr className="text-uppercase">
                                            <th>Timestamp</th>
                                            <th>Phone</th>
                                            <th>Message</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records && records.map((record, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{moment(new Date(String(record.timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                                    <td>{record.phone}</td>
                                                    <td>{record.message}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </StyledTable>
                            </>
                    }
                </>
            </div>
        </>

    )
}

export default RecordsPage