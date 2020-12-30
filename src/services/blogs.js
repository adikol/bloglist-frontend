import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  console.log('getAll blogs')
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  console.log('creating new blog', newObject)
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  console.log('updating blog')

  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${ baseUrl }/${id}`, newObject, config)
  return response.data
}

const deleteBlog = async (id) => {
  console.log('deleting blog')

  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${ baseUrl }/${id}`, config)
}

export default { getAll, create, update, setToken, deleteBlog }