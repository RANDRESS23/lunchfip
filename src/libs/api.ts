import axios from 'axios'

console.log('PROCESS: ->', process.env.NODE_ENV)

export default axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://lunchfip.vercel.app/api'
})
