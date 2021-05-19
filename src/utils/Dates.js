export function ConverteStringPraDatetime (data) {
    return new Promise(resolve => {
        var dt = data.split('/')
        resolve(new Date(dt[2], dt[1] - 1, dt[0], 0, 0, 0))
    })
}

export function ConverteDatetimePraString (data) {
    return new Promise(resolve => {
        data = data.toString()
        var dia = 0
        var mes = 0
        var ano = 0
        if (data.includes('/')) {
        resolve(data)
        }
        var dt = []
        if (data.includes('(')) {
        var d = new Date(data)
        dia = adicionaZeroData(d.getDate())
        mes = adicionaZeroData(d.getMonth() + 1)
        ano = d.getFullYear()
        } else {
        dt = data.split('-')
        dia = adicionaZeroData(dt[2].split('T')[0])
        mes = adicionaZeroData(dt[1])
        ano = dt[0]
        }
        resolve(dia + '/' + mes + '/' + ano)
    })
}

export function adicionaZeroData (data) {
    data = parseInt(data)
    if (parseInt(data) < 10) {
        data = '0' + data
    }
    return data
}