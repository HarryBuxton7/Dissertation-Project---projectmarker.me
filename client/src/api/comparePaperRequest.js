import { API_URL } from "./config"

export default (token, firstMarkerGrade, secondMarkerGrade, projectType, degreeProgramme, currentPaperId, finalGrade) => {
    console.log("in api")
  return fetch(`${API_URL}/comparePapers?firstMarkerGrade=${firstMarkerGrade}&secondMarkerGrade=${secondMarkerGrade}&projectType=${projectType}&degreeProgramme=${degreeProgramme}&currentPaperId=${currentPaperId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json'
    }
  })
  .then(response => response.json())
}