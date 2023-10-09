import { API_URL } from "./config"

export default (formData, token) => {
  return fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`
      },
    body: formData
  })
    .then(response => response.json())
}