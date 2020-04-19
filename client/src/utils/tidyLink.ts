const tidyLink = (url: string) => (url.includes('http') ? url : 'http://' + url)

export default tidyLink
