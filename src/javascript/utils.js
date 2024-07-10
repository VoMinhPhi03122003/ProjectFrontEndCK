export const formatNumber = (x, char) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, char)

export function formatRating(rating) {
    const total = Object.keys(rating).reduce((previous, key) => previous + rating[key], 0)
    const average = (Object.keys(rating).reduce((previous, key, index) => previous + (rating[key] * (5 - index)), 0) / total).toFixed(1)
    return {
        total: total,
        average: average,
        avg5: rating['5star'] * 100 / total,
        avg4: rating['4star'] * 100 / total,
        avg3: rating['3star'] * 100 / total,
        avg2: rating['2star'] * 100 / total,
        avg1: rating['1star'] * 100 / total
    }
}

export const getTypes = (json) => {
    const types = []
    json.data.forEach(product => {
        const type = types.find(value => value.id === product.type.id)
        if (type) type.quantity = type.quantity + 1
        else types.push({...product.type, quantity: 1})
    })
    return types.sort((a, b) => a.name < b.name ? -1 : 1)
}

export function getTypeName(typeId) {
    if (typeId === 'android') return 'Android'
    if (typeId === 'java_jsp') return 'Java/JSP'
    if (typeId === 'php_mysql') return 'PHP & MySQL'
    if (typeId === 'visual_csharp') return 'Visual C#'
    if (typeId === 'wordpress') return 'WordPress'
    if (typeId === 'ios') return 'iOS'
    return null
}

export const makeURL = (search, from, type, page, sort) => {
    const searchPart = search != null ? `name_like=${search}&` : ''
    const fromPart = from != null ? `type.id=${from}&` : ''
    const typePart = type != null ? `type.id=${type}&` : ''
    const pagePart = page != null ? `_page=${page}&_limit=12&` : ''
    const sortPart = sort != null ? `_sort=${sort}&_order=desc` : ''
    return trim(trim(`http://localhost:9810/products?${searchPart}${fromPart}${typePart}${pagePart}${sortPart}`, '&'), '?')
}

function trim(s, c) {
    if (c === "]") c = "\\]";
    if (c === "^") c = "\\^";
    if (c === "\\") c = "\\\\";
    return s.replace(new RegExp("^[" + c + "]+|[" + c + "]+$", "g"), "");
}
