export default function DecodeJWT () {
  return new Promise(resolve => {
    const token = localStorage.getItem('token')
    resolve(atob(token.split('.')[1]))
  })
}