import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { useQueryClient, useMutation } from "react-query";
import { TokenContext } from "../App";
import updatePaperRequest from "../api/updatePaperRequest";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ClipLoader from "react-spinners/ClipLoader";
import { set } from "lodash";
import { useNavigate } from "react-router-dom";
import deletePaperRequest from "../api/deletePaperRequest";

export const AdminPaperForm = () => {
  let { fileID } = useParams();
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

  useEffect(() => {
    let paperList = queryClient.getQueryData("adminPapers");
    let thisUrlPaper;

    for (let i in paperList) {
      if (paperList[i]._id == fileID) {
        thisUrlPaper = paperList[i];
      }
    }
    setCurrentPaper(thisUrlPaper);
  }, []);

  const { mutate: deletePaper } = useMutation(
    (fileID) => deletePaperRequest(fileID, token),
    {
      onSettled: () => {
        queryClient.invalidateQueries("adminPapers");
        navigate("/admin");
      },
    }
  );

  return (
    <div>
      {currentPaper ? (
        <div>
          <br></br>
          <Button variant="contained" onClick={() => deletePaper(fileID)}>
            Delete Paper
          </Button>
          <h2>First Marker Name:</h2>
          <p>{currentPaper.firstMarkerName}</p>
          <h2>First Marker Email:</h2>
          <p>{currentPaper.firstMarkerEmail}</p>
          <h2>First Marker Grade:</h2>
          <p>{currentPaper.firstMarkerGrade}</p>
          <h2>Second Marker Name:</h2>
          <p>{currentPaper.secondMarkerName}</p>
          <h2>Second Marker Email:</h2>
          <p>{currentPaper.secondMarkerEmail}</p>
          <h2>Second Marker Grade:</h2>
          <p>{currentPaper.secondMarkerGrade}</p>
          {currentPaper.thirdMarkerName ? <h2>Third Marker Name</h2> : null}
          {currentPaper.thirdMarkerName ? (
            <p>{currentPaper.thirdMarkerName}</p>
          ) : null}
          {currentPaper.thirdMarkerEmail ? <h2>Third Marker Email</h2> : null}
          {currentPaper.thirdMarkerEmail ? (
            <p>{currentPaper.thirdMarkerEmail}</p>
          ) : null}
          {currentPaper.thirdMarkerGrade ? <h2>Third Marker Grade</h2> : null}
          {currentPaper.thirdMarkerGrade ? (
            <p>{currentPaper.thirdMarkerGrade}</p>
          ) : null}
          <h2>Inspection Feedback:</h2>
          <p>{currentPaper.inspectionFeedback}</p>
          <h2>Outcome Of Demonstration:</h2>
          <p>{currentPaper.outcomeOfDemonstration}</p>
          <h2>Formative Feedback:</h2>
          <p>{currentPaper.formativeFeedback}</p>
          <h2>Concerns About Project Or Student:</h2>
          <p>{currentPaper.concernsAboutProjectOrStudent}</p>
          <h2>Final Grade:</h2>
          <p>{currentPaper.finalGrade}</p>
          <h2>Supervisor Feedback:</h2>
          <p>{currentPaper.supervisorFeedback}</p>
        </div>
      ) : (
        <ClipLoader />
      )}
    </div>
  );
};
