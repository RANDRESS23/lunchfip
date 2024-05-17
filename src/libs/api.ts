import axios from 'axios'

const productDomain = process.env.PRODUCTION_DOMAIN_API ?? process.env.PREVIEW_DOMAIN_API

export default axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_DOMAIN_API : productDomain
})
