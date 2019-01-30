import axios from 'axios'

export default axios.create({
  baseURL: 'https://server.vroggy.fun/',
  // baseURL: 'http://localhost:3000/'
 });