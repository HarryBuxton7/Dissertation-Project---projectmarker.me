import { API_URL } from "./config";

export default (fileID, token) => {
    return fetch(`${API_URL}/papers/${fileID}`, {
      method: 'DELETE', 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      }
    })
    .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(text);
          });
        }
        return response.json();
      });
}
