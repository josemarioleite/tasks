export function DecodeJWTStorage () {
  return new Promise(resolve => {
    const token = sessionStorage.getItem('token')
    resolve(atob(token.split('.')[1]))
  })
}

export function DecodeJWT (token) {
  return new Promise(resolve => {
    const tk = token
    resolve(atob(tk.split('.')[1]))
  })
}