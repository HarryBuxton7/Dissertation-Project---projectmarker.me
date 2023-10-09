import { API_URL } from "./config"

export default (email, password) => {
    return fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return response.text().then(error => {
          throw new Error(error);
        });
      }
    })
}