import { API_URL } from "./config"

export default (token, fileID) => {
    return fetch(`${API_URL}/papers/${fileID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      }
    })
      .then(response => response.json())
  }