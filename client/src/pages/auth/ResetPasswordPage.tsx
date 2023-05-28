import React, { useState } from 'react'
import ResetPasswordForm from '../../components/forms/ResetPasswordForm'
import ResetPasswordSendMailForm from '../../components/forms/ResetPasswordSendMailForm'
import { useParams } from 'react-router-dom'

function ResetPasswordPage() {
    const { token } = useParams()
    return (
        <>
            {(token && token !== ":token")
                ?
                <ResetPasswordForm token={token} />
                :
                <ResetPasswordSendMailForm />
            }
            <p className="text-capitalize position-absolute w-100 bottom-0 mt-2 p-2 bg-primary text-light text-center">Copyright @ Agarson shoes pvt. ltd.</p>
        </>
    )
}

export default ResetPasswordPage