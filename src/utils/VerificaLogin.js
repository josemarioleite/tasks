import { Get } from './Conexao.js'

export function VerificaLogin () {
  const cliente = window.location.pathname
  const urlAtual = window.location.href
  const token = localStorage.getItem('token')
  if (token !== null || token !== '') {
    Get('v1/usuario/auth/token').then(res => {
      const resposta = res.status
      if (resposta === 200) {
        window.location.href = urlAtual
      }
    }).catch(() => {
      window.location.href = cliente
    })
  } else {
    window.location.href = cliente
  }
}
