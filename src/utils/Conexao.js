import axios from 'axios'
import Guids from './GuidEmpresa.js'

const protocolo = location.protocol

const portaHttp = 9876
const portaHttps = 9877
const linkUrlTarefa = 'https://runrun.it/api/v1.0/tasks/'

let url = protocolo + '//192.168.0.14:'
if (protocolo === 'http:') {
  url = url + portaHttp + '/api/'
} else if (protocolo === 'https:') {
  url = url + portaHttps + '/api/'
}

export function preparaConexao () {
  return new Promise(resolve => {
    axios.defaults.baseURL = url
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios.defaults.headers.put['Content-Type'] = 'application/json'
    axios.defaults.headers.patch['Content-Type'] = 'application/json'
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    Guids().then((result) => {
      axios.defaults.headers.common['X-Empresa-Guid'] = result
    })
    resolve()
  })
}

export function Patch (rota, objeto) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      const json = JSON.stringify(objeto)
      axios.patch(url + rota, json).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function Post (rota, objeto) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      const json = JSON.stringify(objeto)
      axios.post(url + rota, json).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function Get (rota) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      axios.get(url + rota).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function Delete (rota) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      axios.delete(url + rota).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function Put (rota, objeto) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      const json = JSON.stringify(objeto)
      axios.put(url + rota, json).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}
