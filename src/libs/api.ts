import axios from 'axios'

/* ➡ Configurando axios para las peticiones a la API */
export default axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://www.lunchfip.online/api'
})
