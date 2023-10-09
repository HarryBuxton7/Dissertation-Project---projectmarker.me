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

export const ProjectInspectionForm = () => {
  let { fileID } = useParams();
  const [grade, setGrade] = useState();
  const [comment, setComment] = useState();
  const [token, setToken, userID, setUserId, selectedCohort, setSelectedCohort] = useContext(TokenContext);
  const queryClient = useQueryClient();
  const [currentPaper, setCurrentPaper] = useState();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [completedInspection, setCompletedInspection] = useState(false);

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
        console.log("updated")
        queryClient.invalidateQueries("papers");
        if (paper.status == "Final Demonstration" && variables.completedInspection) {
          console.log("reached")
          navigate("/");
        }
      },
    }
  );

  function completeInspectionHandler(e) {
    e.preventDefault();
    let tempPaper = { ...currentPaper };
    tempPaper.status = "Final Demonstration";
    setCompletedInspection(true)
    updatePaper({
      ...tempPaper,
      completedInspection: true,
    });
  }
     
  return (
    <div>
      {!currentPaper ? (
        <ClipLoader size={150} />
      ) : currentPaper.secondMarkerID == userID ? (
        currentPaper.status == "Project Inspection" ? (
          <div>
            <h2>Formative Feedback by {currentPaper.firstMarkerName}</h2>
            <h2>Demonstration date: {currentPaper.projectInspectionDate}</h2>
            <form autoComplete="off" onSubmit={completeInspectionHandler}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Enter Feedback"
                type="text"
                fullWidth
                multiline
                value={currentPaper.inspectionFeedback}
                onChange={(e) => {
                  let tempPaper = currentPaper;
                  tempPaper.inspectionFeedback = e.target.value;
                  updatePaper(tempPaper);
                }}
              />
              <br></br>
              <br></br>
              <Button variant="contained" type="submit">
                Complete Inspection
              </Button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Formative Feedback by {currentPaper.firstMarkerName}</h2>
            <h2>Demonstration date: {currentPaper.projectInspectionDate}</h2>
            <form autoComplete="off" onSubmit={completeInspectionHandler}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Edit Feedback"
                type="text"
                fullWidth
                multiline
                value={currentPaper.inspectionFeedback}
                onChange={(e) => {
                  let tempPaper = currentPaper;
                  tempPaper.inspectionFeedback = e.target.value;
                  updatePaper(tempPaper);
                }}
              />
              <br></br>
              <br></br>
            </form>
          </div>
        )
      ) : (
        <div>
          <h2>Formative Feedback by {currentPaper.secondMarkerName}</h2>
          <h2>Inspection date: {currentPaper.projectInspectionDate}</h2>
          <h2>Feedback:</h2>
          <p>
            {currentPaper.inspectionFeedback
              ? currentPaper.inspectionFeedback
              : "Not yet given feedback"}
          </p>
        </div>
      )}
      {completedInspection && <ClipLoader size={150} />}
    </div>
  );
};
