import { API_URL } from "./config";

export default (paper, token) => {
  return fetch(`${API_URL}/papers/${paper._id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionFeedback: paper.inspectionFeedback,
      status: paper.status,
      outcomeOfDemonstration: paper.outcomeOfDemonstration,
      formativeFeedback: paper.formativeFeedback,
      concernsAboutTheProjectOrTheStudent: paper.concernsAboutTheProjectOrTheStudent,
      firstMarkerComment: paper.firstMarkerComment,
      secondMarkerComment: paper.secondMarkerComment,
      firstMarkerGrade: paper.firstMarkerGrade,
      secondMarkerGrade: paper.secondMarkerGrade,
      supervisorStudentFeedback: paper.supervisorStudentFeedback,
      thirdMarkerEmail: paper.thirdMarkerEmail,
      thirdMarkerComment: paper.thirdMarkerComment,
      thirdMarkerGrade: paper.thirdMarkerGrade,
      finalGrade: paper.finalGrade,
    }),
  }).then((response) => response.json());
};
