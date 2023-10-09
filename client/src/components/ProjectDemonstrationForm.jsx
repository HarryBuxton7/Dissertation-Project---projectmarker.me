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

export const ProjectDemonstrationForm = () => {
  let { fileID } = useParams();
  const [grade, setGrade] = useState();
  const [comment, setComment] = useState();
  const [
    token,
    setToken,
    userID,
    setUserId,
    selectedCohort,
    setSelectedCohort,
  ] = useContext(TokenContext);
  const queryClient = useQueryClient();
  const [currentPaper, setCurrentPaper] = useState();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
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
      onSettled: (paper, _, variables) => {
        queryClient.invalidateQueries("papers");
        if (
          paper.status == "Initial Blind Marking" &&
          variables.isInspectionComplete
        ) {
          navigate("/");
        }
      },
    }
  );

  function completeInspectionHandler(e) {
    e.preventDefault();
    let tempPaper = { ...currentPaper };
    tempPaper.status = "Initial Blind Marking";
    setLoadingSubmit(true);
    updatePaper({
      ...tempPaper,
      isInspectionComplete: true,
    });
  }

  return (
    <div>
      {!currentPaper ? (
        <ClipLoader size={150} />
      ) : currentPaper.secondMarkerID == userID ? (
        currentPaper.status == "Final Demonstration" ? (
          <div>
            <h2>Formative Feedback by {currentPaper.firstMarkerName}</h2>
            <h2>Demonstration date: {currentPaper.projectInspectionDate}</h2>
            <form autoComplete="off" onSubmit={completeInspectionHandler}>
              <h1>Outcome of Demonstration</h1>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter Outcome"
                type="text"
                fullWidth
                multiline
                value={currentPaper.outcomeOfDemonstration}
                onChange={(e) => {
                  let tempPaper = currentPaper;
                  tempPaper.outcomeOfDemonstration = e.target.value;
                  updatePaper(tempPaper);
                }}
              />
              <br></br>
              <br></br>
              <h1>Formative Feedback</h1>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter Feedback"
                type="text"
                fullWidth
                multiline
                value={currentPaper.formativeFeedback}
                onChange={(e) => {
                  let tempPaper = currentPaper;
                  tempPaper.formativeFeedback = e.target.value;
                  updatePaper(tempPaper);
                }}
              />
              <br></br>
              <br></br>
              <h1>Concerns about the Project or the Student</h1>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter Concerns"
                type="text"
                fullWidth
                multiline
                value={currentPaper.concernsAboutTheProjectOrTheStudent}
                onChange={(e) => {
                  let tempPaper = currentPaper;
                  tempPaper.concernsAboutTheProjectOrTheStudent =
                    e.target.value;
                  updatePaper(tempPaper);
                }}
              />
              <br></br>
              <br></br>

              <Button variant="contained" type="submit">
                Complete Demonstration
              </Button>
            </form>
            {loadingSubmit && <ClipLoader size={150} />}
          </div>
        ) : (
          <div>
            <form autoComplete="off" onSubmit={completeInspectionHandler}>
              <h1>Outcome of Demonstration</h1>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Edit Outcome"
                type="text"
                fullWidth
                multiline
                value={currentPaper.outcomeOfDemonstration}
                onChange={(e) => {
                  let tempPaper = currentPaper;
                  tempPaper.outcomeOfDemonstration = e.target.value;
                  updatePaper(tempPaper);
                }}
              />
              <br></br>
              <br></br>
              <h1>Formative Feedback</h1>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Edit Feedback"
                type="text"
                fullWidth
                multiline
                value={currentPaper.formativeFeedback}
                onChange={(e) => {
                  let tempPaper = currentPaper;
                  tempPaper.formativeFeedback = e.target.value;
                  updatePaper(tempPaper);
                }}
              />
              <br></br>
              <br></br>
              <h1>Concerns about the Project or the Student</h1>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Edit Concerns"
                type="text"
                fullWidth
                multiline
                value={currentPaper.concernsAboutTheProjectOrTheStudent}
                onChange={(e) => {
                  let tempPaper = currentPaper;
                  tempPaper.concernsAboutTheProjectOrTheStudent =
                    e.target.value;
                  updatePaper(tempPaper);
                }}
              />
              <br></br>
              <br></br>
            </form>
            {loadingSubmit && <ClipLoader size={150} />}
          </div>
        )
      ) : (
        <div>
          <h2>Formative Feedback by {currentPaper.secondMarkerName}</h2>
          <h2>Demonstration Date: {currentPaper.finalDemonstrationDate}</h2>

          <h2>Outcome of Demonstration:</h2>
          {currentPaper.outcomeOfDemonstration ? (
            <p>{currentPaper.outcomeOfDemonstration}</p>
          ) : (
            <p>Not yet recieved feedback</p>
          )}

          <h2>Formative Feedback:</h2>
          {currentPaper.formativeFeedback ? (
            <p>{currentPaper.formativeFeedback}</p>
          ) : (
            <p>Not yet recieved feedback</p>
          )}

          <h2>Concerns about the Project or the Student:</h2>
          {currentPaper.concernsAboutTheProjectOrTheStudent ? (
            <p>{currentPaper.concernsAboutTheProjectOrTheStudent}</p>
          ) : (
            <p>Not yet recieved feedback</p>
          )}
        </div>
      )}
    </div>
  );
};

/*            //outcomeOfDemonstration
            //formativeFeedback
            //concernsAboutTheProjectOrTheStudent
            */
