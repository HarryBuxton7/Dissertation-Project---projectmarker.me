import { API_URL } from "./config"

export default (token, cohort) => {
  return fetch(`${API_URL}/cohortPapers?cohort=${cohort}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
    .then(response => response.json())
}