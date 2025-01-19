import axios from 'axios'
import { signOut } from 'next-auth/react'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/login' })
    }

    
return Promise.reject(error)
  }
)

export default axiosClient
