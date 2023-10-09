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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

export const SecondResolutionForm = () => {
  let { fileID } = useParams();
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
    try {
      setGrade(thisUrlPaper.thirdMarkerGrade);
      setComment(thisUrlPaper.thirdMarkerComment);
    } catch (err) {}
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
        if (variables.actionType === "submitThirdMarkerGrade") {
          navigate("/");
        } else if (variables.actionType === "submitFinalGrade") {
          navigate("/");
        }
      },
    }
  );
  
  function handleGradeSubmit(e) {
    e.preventDefault();
    setLoadingSubmit(true);
    let tempPaper = { ...currentPaper };
    tempPaper.thirdMarkerGrade = grade;
    updatePaper({
      ...tempPaper,
      actionType: "submitThirdMarkerGrade"
    });
  }
  
  function handleFinalGradeSubmit(e) {
    setSubmitGradeOpen(false);
    e.preventDefault();
    setLoadingSubmit(true);
    let tempPaper = { ...currentPaper };
    tempPaper.finalGrade = grade;
    tempPaper.status = "Supervisor Feedback";
    updatePaper({
      ...tempPaper,
      actionType: "submitFinalGrade"
    });
  }

  const [open, setOpen] = React.useState(false);
  const [requestMarkerOpen, setRequestMarkerOpen] = React.useState(false);
  const [submitGradeOpen, setSubmitGradeOpen] = React.useState(false);

  return (
    <div>
      {!currentPaper ? (
        <ClipLoader size={150} />
      ) : currentPaper.status == "Second Resolution" ? (
        !currentPaper.thirdMarkerEmail ? (
          <div>Waiting for third marker to be assigned</div>
        ) : !currentPaper.thirdMarkerGrade &&
          userID == currentPaper.thirdMarkerID ? (
          <div>
            <h1>Enter your Comment</h1>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Enter Comment"
              type="Text"
              fullWidth
              multiline
              value={currentPaper.thirdMarkerComment}
              onChange={(e) => {
                let tempPaper = currentPaper;
                tempPaper.thirdMarkerComment = e.target.value;
                updatePaper(tempPaper);
              }}
            />
            <br></br>
            <br></br>
            <h1>Enter your Grade</h1>
            <form autoComplete="off" onSubmit={handleGradeSubmit}>
              <TextField
                type="number"
                id="outlined-basic"
                label="Grade"
                variant="outlined"
                onChange={(e) => {
                  if (
                    Number.isInteger(+e.target.value) &&
                    e.target.value >= 0 &&
                    e.target.value <= 100
                  ) {
                    setGrade(e.target.value);
                  }
                }}
                value={grade}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 1, // Step property ensures that only integer values can be incremented or decremented via the arrow keys.
                }}
              />

              <br></br>
              <br></br>
              <Button variant="contained" type="submit">
                Submit Grade
              </Button>
            </form>
            <br></br>
            {loadingSubmit && <ClipLoader size={150} />}
          </div>
        ) : !currentPaper.thirdMarkerGrade ? (
          <div>Waiting for third marker {currentPaper.thirdMarkerEmail} to grade the paper.</div>
        ) : (
          <div>
            <h2>First Marker Grade:</h2>
            <p>{currentPaper.firstMarkerGrade}</p>
            <h2>First Marker Comment:</h2>
            <p>{currentPaper.firstMarkerComment}</p>
            <h2>Second Marker's Grade:</h2>
            <p>{currentPaper.secondMarkerGrade}</p>
            <h2>Second Marker's Comment:</h2>
            <p>{currentPaper.secondMarkerComment}</p>
            <h2>Second Marker's Email:</h2>
            <p>{currentPaper.secondMarkerEmail}</p>
            <h2>Difference between two grades:</h2>
            <p>
              {Math.abs(
                currentPaper.firstMarkerGrade - currentPaper.secondMarkerGrade
              )}
            </p>
            <h1>Third Marker Grade:</h1>
            <p>{currentPaper.thirdMarkerGrade}</p>
            <h1>Third Marker Comment:</h1>
            <p>{currentPaper.thirdMarkerComment}</p>
            <h1>Third Marker Email:</h1>
            <p>{currentPaper.thirdMarkerEmail}</p>
            <TextField
              type="number"
              id="outlined-basic"
              label="Grade"
              variant="outlined"
              onChange={(e) => {
                if (
                  Number.isInteger(+e.target.value) &&
                  e.target.value >= 0 &&
                  e.target.value <= 100
                ) {
                  setGrade(e.target.value);
                }
              }}
              value={grade}
              inputProps={{
                min: 0,
                max: 100,
                step: 1, // Step property ensures that only integer values can be incremented or decremented via the arrow keys.
              }}
            />
            <br></br>
            <br></br>
            <Button variant="outlined" onClick={() => setSubmitGradeOpen(true)}>
              Submit Final Grade
            </Button>
            <Dialog
              open={submitGradeOpen}
              onClose={() => setSubmitGradeOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Submit Final Grade?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  This will submit the final grade for the project. Ensure this
                  has been agreed with the other marker before accepting.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSubmitGradeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFinalGradeSubmit} autoFocus>
                  Submit Grade
                </Button>
              </DialogActions>
            </Dialog>
            <br></br>
            {loadingSubmit && <ClipLoader size={150} />}
          </div>
        )
      ) : (
        <div>
          {!currentPaper.finalGrade ? (
            <p>Not at this stage yet</p>
          ) : (
            <div>
              <h2>First Marker Grade:</h2>
              <p>{currentPaper.firstMarkerGrade}</p>
              <h2>First Marker Comment:</h2>
              <p>{currentPaper.firstMarkerComment}</p>
              <h2>First Marker's Email:</h2>
              <p>{currentPaper.firstMarkerEmail}</p>
              <h2>Second Marker's Grade:</h2>
              <p>{currentPaper.secondMarkerGrade}</p>
              <h2>Second Marker's Comment:</h2>
              <p>{currentPaper.secondMarkerComment}</p>
              <h2>Second Marker's Email:</h2>
              <p>{currentPaper.secondMarkerEmail}</p>
              <h2>Third Marker's Email:</h2>
              <p>{currentPaper.thirdMarkerEmail}</p>
              <h2>Third Marker's Grade:</h2>
              <p>{currentPaper.thirdMarkerGrade}</p>
              <h2>Third Marker's Comment:</h2>
              <p>{currentPaper.thirdMarkerComment}</p>
              <h2>Final Grade:</h2>
              <p>{currentPaper.finalGrade}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
