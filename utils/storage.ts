export const getStorage = (key: string) => {
  const item = localStorage.getItem(key)
  if(item) {
      return JSON.parse(item)
  }

  return null
}

export const setStorage = (key: string, data: any) => {
  return localStorage.setItem(key, JSON.stringify(data))
}