export default function Guids () {
  return new Promise(resolve => {
    const cliente = window.location.href
    let guid = 0
    if (cliente.includes('relatoriobi')) {
      guid = 'FBCB9F1D-86DF-405E-838B-D2FFCD26CFE0'
    } else {
      guid = 'FBCB9F1D-86DF-405E-838B-D2FFCD26CFE0'
    }
    resolve(guid)
  })
}