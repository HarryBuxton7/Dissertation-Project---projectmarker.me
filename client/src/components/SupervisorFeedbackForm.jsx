import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { TokenContext } from "../App";
import updatePaperRequest from "../api/updatePaperRequest";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import getPaperRequest from "../api/getPaperRequest";
import getPapersRequest from "../api/getPapersRequest";

export const SupervisorFeedbackForm = () => {
  let { fileID } = useParams();
  const [comment, setComment] = useState();
  const [token, setToken, userID, setUserId, selectedCohort, setSelectedCohort] = useContext(TokenContext);
  const queryClient = useQueryClient();
  const [currentPaper, setCurrentPaper] = useState();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [grade, setGrade] = useState();
  const [loadingSubmit, setLoadingSubmit] = useState(false);


  useEffect(() => {
    let paperList = queryClient.getQueryData("papers");
    let thisUrlPaper;
    for (let i in paperList) {
      if (paperList[i]._id == fileID) {
        thisUrlPaper = paperList[i];
      }
    }
    setCurrentPaper(thisUrlPaper);
    if (thisUrlPaper.firstMarkerID == userID) {
      setGrade(thisUrlPaper.firstMarkerGrade);
      setComment(thisUrlPaper.firstMarkerComment);
      setRole("firstMarker");
    } else if (thisUrlPaper.secondMarkerID == userID) {
      setGrade(thisUrlPaper.secondMarkerGrade);
      setComment(thisUrlPaper.secondMarkerComment);
      setRole("secondMarker");
    }
  }, []);

  const {} = useQuery("paper", () => getPaperRequest(token, fileID), {
    onSettled: (paper) => {
      console.log(paper);
      setCurrentPaper(paper);
    },
  });

  const { mutate: updatePaper } = useMutation(
    (updatedPaper) => updatePaperRequest(updatedPaper, token),
    {
      onSettled: async (paper, _, variables) => {
        if (variables.actionType === "submitFeedback") {
          await queryClient.invalidateQueries("papers");
          await queryClient.prefetchQuery("papers", () => getPapersRequest(token));
          navigate("/");
        }
      },
    }
  );
  
  function handleFeedbackSubmit(e) {
    e.preventDefault();
    setLoadingSubmit(true);
    let tempPaper = { ...currentPaper };
    tempPaper.status = "Completed";
    updatePaper({
      ...tempPaper,
      actionType: "submitFeedback"
    });
  }
  

  return (
    <div>
      {!currentPaper ? (
        <ClipLoader size={150} />
      ) : currentPaper.status === "Supervisor Feedback" && userID == currentPaper.firstMarkerID ? (
        <div>
          <form autoComplete="off" onSubmit={handleFeedbackSubmit}>
            <h1>Submit your final feedback to student</h1>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Enter Feedback"
              type="Text"
              fullWidth
              multiline
              value={currentPaper.supervisorStudentFeedback}
              onChange={(e) => {
                let tempPaper = currentPaper;
                tempPaper.supervisorStudentFeedback = e.target.value
                console.log(tempPaper)
                updatePaper(tempPaper);
              }}
            />
              <Button variant="contained" type="submit">
                Submit Feedback
              </Button>
          </form>
          <br></br>
            {loadingSubmit && <ClipLoader size={150} />}
        </div>
      ) : currentPaper.status === "Supervisor Feedback" ? (
        <div>
          <h1>Feedback for student:</h1>
          <p>{currentPaper.supervisorStudentFeedback}</p>
        </div>
      ) : currentPaper.supervisorStudentFeedback ? (
        <div>
          <h1>Feedback for student:</h1>
          <p>{currentPaper.supervisorStudentFeedback}</p>
        </div>
      ): (
        <div>
          Not at this stage yet
        </div>
      )}
    </div>
  );
};
