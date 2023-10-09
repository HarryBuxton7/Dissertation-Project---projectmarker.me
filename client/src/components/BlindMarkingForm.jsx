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

export const BlindMarkingForm = () => {
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
      onSuccess: (paper, variables) => {
        queryClient.invalidateQueries("papers");
        if (variables.isGradeSubmitted) {
          navigate("/");
        }
      },
    }
  );
  
  function handleGradeSubmit(e) {
    e.preventDefault();
    let tempPaper = { ...currentPaper };
    setLoadingSubmit(true);
  
    tempPaper.firstMarkerID == userID
      ? (tempPaper.firstMarkerGrade = grade)
      : (tempPaper.secondMarkerGrade = grade);
  
    updatePaper({
      ...tempPaper,
      isGradeSubmitted: true,
    });
  }

  return (
    <div>
      {!currentPaper ? (
        <ClipLoader size={150} />
      ) : currentPaper.status === "Initial Blind Marking" ? (
        <div>
          <h1>Enter your Comment</h1>
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Enter Comment"
            type="Text"
            fullWidth
            multiline
            value={
              currentPaper.firstMarkerID == userID
                ? currentPaper.firstMarkerComment
                : currentPaper.secondMarkerComment
            }
            onChange={(e) => {
              let tempPaper = currentPaper;
              currentPaper.firstMarkerID == userID
                ? (tempPaper.firstMarkerComment = e.target.value)
                : (tempPaper.secondMarkerComment = e.target.value);
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
            <br></br>
            {loadingSubmit && <ClipLoader size={150} />}
          </form>
        </div>
      ) : currentPaper.firstMarkerGrade && currentPaper.secondMarkerGrade ? (
        <div>
          <h1>First Marker Grade:</h1>
          <p>{currentPaper.firstMarkerGrade}</p>
          <h1>Comment:</h1>
          <p>{currentPaper.firstMarkerComment}</p>
          <h1>Second Marker Grade:</h1>
          <p>{currentPaper.secondMarkerGrade}</p>
          <h1>Comment:</h1>
          <p>{currentPaper.secondMarkerComment}</p>
        </div>
      ) : (
        <div>Not at marking stage yet</div>
      )}
    </div>
  );
};

/*            //outcomeOfDemonstration
            //formativeFeedback
            //concernsAboutTheProjectOrTheStudent
            */
