import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedPage = ({element}) => {
    if(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))){
        return element
    }
  return <Navigate to='/auth/login' replace />
}

export default ProtectedPage