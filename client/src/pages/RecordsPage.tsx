import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { IRecord } from '../types/Record'
import { BackendError } from '../types'
import { GetRecord } from '../services/MessageServices'
import { Button, Form } from 'react-bootstrap'
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
  font-size:14px;
  
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
    const { data, isSuccess, refetch, isLoading } = useQuery<AxiosResponse<IRecord[]>, BackendError>(["records", phone], () => GetRecord(phone), {
        refetchOnMount: true
    })
    const [records, setRecords] = useState<IRecord[]>([])

    useEffect(() => {
        if (isSuccess)
            setRecords(data.data)
    }, [isSuccess, data])

    return (
        <>
            <Form>
                <Form.Control
                    className="border border-primary"
                    placeholder={`${records && records.length ? `${records.length} records` : "Search By Phone Number"}`}
                    type="search"
                    onChange={(e) => setPhone(Number(e.currentTarget
                        .value))}

                />

                <Button variant="primary"
                    onClick={() => {
                        refetch()
                    }}
                >
                </Button>
            </Form>
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
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records && records.map((record, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{moment(new Date(String(record.timestamp))).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                                <td>{record.message}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </StyledTable>
                        </>
                }
            </>
        </>
    )
}

export default RecordsPage