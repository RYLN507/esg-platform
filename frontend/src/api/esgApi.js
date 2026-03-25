import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({ baseURL: BASE_URL })

export const getCompanyESG = (ticker) =>
  api.get(`/api/company/${ticker}`).then(r => r.data)

export const getIndustryPeers = (sector) =>
  api.get(`/api/industry/${sector}`).then(r => r.data)

export const getSectors = () =>
  api.get('/api/sectors').then(r => r.data)

export const getComposite = (ticker, weights) =>
  api.post(`/api/composite/${ticker}`, weights).then(r => r.data)

export const compareCompanies = (tickers) =>
  api.get(`/api/compare?tickers=${tickers.join(',')}`).then(r => r.data)