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
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import comparePaperRequest from "../api/comparePaperRequest";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
} from "@mui/material";
import { set } from "lodash";

export const FirstResolutionForm = () => {
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
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [grade, setGrade] = useState();
  const [firstMarkerGrade, setFirstMarkerGrade] = useState();
  const [secondMarkerGrade, setSecondMarkerGrade] = useState();
  const [projectType, setProjectType] = useState();
  const [degreeProgramme, setDegreeProgramme] = useState();
  const [finalGrade, setFinalGrade] = useState();
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
    setFirstMarkerGrade(thisUrlPaper.firstMarkerGrade);
    setSecondMarkerGrade(thisUrlPaper.secondMarkerGrade);
    setProjectType(thisUrlPaper.projectType);
    setDegreeProgramme(thisUrlPaper.degreeProgramme);
  }, []);

  const {} = useQuery("paper", () => getPaperRequest(token, fileID), {
    onSettled: (paper) => {
      console.log(paper);
      setCurrentPaper(paper);
    },
  });

  const { data: comparePapers } = useQuery(
    "comparePapers",
    () =>
      comparePaperRequest(
        token,
        firstMarkerGrade,
        secondMarkerGrade,
        projectType,
        degreeProgramme,
        fileID
      ),
    {
      enabled:
        firstMarkerGrade !== undefined &&
        secondMarkerGrade !== undefined &&
        projectType !== undefined &&
        degreeProgramme !== undefined,
    }
  );

  const { mutate: updatePaper } = useMutation(
    (updatedPaper) => updatePaperRequest(updatedPaper, token),
    {
      onSettled: (paper, _, variables) => {
        queryClient.invalidateQueries("papers");
        if (variables.actionType === "requestThirdMarker") {
          navigate("/");
        } else if (variables.actionType === "submitGrade") {
          navigate("/");
        }
      },
    }
  );

  function requestThirdMarkerHandler(e) {
    setRequestMarkerOpen(false);
    e.preventDefault();
    setLoadingSubmit(true);
    let tempPaper = { ...currentPaper };
    tempPaper.status = "Second Resolution";
    updatePaper({
      ...tempPaper,
      actionType: "requestThirdMarker",
    });
  }

  function handleGradeSubmit(e) {
    setSubmitGradeOpen(false);
    e.preventDefault();
    setLoadingSubmit(true);
    let tempPaper = { ...currentPaper };
    tempPaper.finalGrade = grade;
    tempPaper.status = "Supervisor Feedback";
    updatePaper({
      ...tempPaper,
      actionType: "submitGrade",
    });
  }

  const [open, setOpen] = React.useState(false);
  const [requestMarkerOpen, setRequestMarkerOpen] = React.useState(false);
  const [submitGradeOpen, setSubmitGradeOpen] = React.useState(false);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  return (
    <div>
      {!currentPaper ? (
        <ClipLoader size={150} />
      ) : currentPaper.status == "First Resolution" ? (
        currentPaper.firstMarkerID == userID ? (
          <div>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="stretch"
            >
              <Grid item xs>
                <h2>Your Grade:</h2>
                <p>{currentPaper.firstMarkerGrade}</p>
                <h2>Your Comment:</h2>
                <p>{currentPaper.firstMarkerComment}</p>
                <h2>Papers with similar grade and same degree programme</h2>
                {!comparePapers ? (
                  <ClipLoader size={150} />
                ) : (
                  <Table aria-label="comparison table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Canvas Link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comparePapers.papersWithSameProgram1st.map((paper) => (
                        <TableRow key={paper._id}>
                          {" "}
                          {/* Assuming paper has a unique _id field for the key */}
                          <TableCell>
                            {new Date(
                              paper.finalDemonstrationDate
                            ).getFullYear()}
                          </TableCell>
                          <TableCell>{paper.finalGrade}</TableCell>
                          <TableCell>
                            <Link
                              href={paper.linkToCanvasDownload}
                              target="_blank"
                              rel="noopener"
                            >
                              Canvas Link
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Grid>
              <br></br>
              <Grid item xs>
                <h2>Second Marker Grade:</h2>
                <p>{currentPaper.secondMarkerGrade}</p>
                <h2>Second Marker Comment:</h2>
                <p>{currentPaper.secondMarkerComment}</p>
                <h2>Second Marker Email:</h2>
                <p>{currentPaper.secondMarkerEmail}</p>
                <h2>Papers with similar grade and same degree programme</h2>
                {!comparePapers ? (
                  <ClipLoader size={150} />
                ) : (
                  <Table aria-label="comparison table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Canvas Link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comparePapers.papersWithSameProgram2nd.map((paper) => (
                        <TableRow key={paper._id}>
                          {" "}
                          {/* Assuming paper has a unique _id field for the key */}
                          <TableCell>
                            {new Date(
                              paper.finalDemonstrationDate
                            ).getFullYear()}
                          </TableCell>
                          <TableCell>{paper.finalGrade}</TableCell>
                          <TableCell>
                            <Link
                              href={paper.linkToCanvasDownload}
                              target="_blank"
                              rel="noopener"
                            >
                              Canvas Download
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Grid>
              <br></br>
              <Grid item xs>
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

                <Button
                  variant="outlined"
                  onClick={() => setSubmitGradeOpen(true)}
                  sx={{ marginRight: "16px" }}
                >
                  Submit Final Grade
                </Button>
                <Dialog
                  open={submitGradeOpen}
                  onClose={() => setSubmitGradeOpen(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Submit final grade?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      This will submit the final grade for the project. Ensure
                      this has been agreed with the other marker before
                      accepting.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setSubmitGradeOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGradeSubmit} autoFocus>
                      Submit Grade
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button
                  variant="outlined"
                  onClick={() => setRequestMarkerOpen(true)}
                >
                  Request Third Marker
                </Button>
                <Dialog
                  open={requestMarkerOpen}
                  onClose={() => setRequestMarkerOpen(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Request a Third Marker?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      This will inform the admin to fill in a third marker.
                      Ensure this has been agreed with the other marker before
                      accepting.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setRequestMarkerOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={requestThirdMarkerHandler} autoFocus>
                      Request Third Marker
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
            <br></br>
            {loadingSubmit && <ClipLoader size={150} />}
          </div>
        ) : (
          <div>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="stretch"
            >
              <Grid item xs>
                <h2>Your Grade:</h2>
                <p>{currentPaper.secondMarkerGrade}</p>
                <h2>Your Comment:</h2>
                <p>{currentPaper.secondMarkerComment}</p>
                <h2>Papers with similar grade and same degree programme</h2>
                {!comparePapers ? (
                  <ClipLoader size={150} />
                ) : (
                  <Table aria-label="comparison table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Canvas Link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comparePapers.papersWithSameProgram2nd.map((paper) => (
                        <TableRow key={paper._id}>
                          {" "}
                          {/* Assuming paper has a unique _id field for the key */}
                          <TableCell>
                            {new Date(
                              paper.finalDemonstrationDate
                            ).getFullYear()}
                          </TableCell>
                          <TableCell>{paper.finalGrade}</TableCell>
                          <TableCell>
                            <Link
                              href={paper.linkToCanvasDownload}
                              target="_blank"
                              rel="noopener"
                            >
                              Canvas Link
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Grid>
              <br></br>
              <Grid item xs>
                <h2>First Marker Grade:</h2>
                <p>{currentPaper.firstMarkerGrade}</p>
                <h2>First Marker Comment:</h2>
                <p>{currentPaper.firstMarkerComment}</p>
                <h2>First Marker Email:</h2>
                <p>{currentPaper.firstMarkerEmail}</p>
                <h2>Papers with similar grade and same degree programme</h2>
                {!comparePapers ? (
                  <ClipLoader size={150} />
                ) : (
                  <Table aria-label="comparison table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Canvas Link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comparePapers.papersWithSameProgram1st.map((paper) => (
                        <TableRow key={paper._id}>
                          {" "}
                          {/* Assuming paper has a unique _id field for the key */}
                          <TableCell>
                            {new Date(
                              paper.finalDemonstrationDate
                            ).getFullYear()}
                          </TableCell>
                          <TableCell>{paper.finalGrade}</TableCell>
                          <TableCell>
                            <Link
                              href={paper.linkToCanvasDownload}
                              target="_blank"
                              rel="noopener"
                            >
                              Canvas Download
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Grid>
              <br></br>
              <Grid item xs>
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

                <Button
                  variant="outlined"
                  onClick={() => setSubmitGradeOpen(true)}
                  sx={{ marginRight: "16px" }}
                >
                  Submit Final Grade
                </Button>
                <Dialog
                  open={submitGradeOpen}
                  onClose={() => setSubmitGradeOpen(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Request a Third Marker?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      This will submit the final grade for the project. Ensure
                      this has been agreed with the other marker before
                      accepting.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setSubmitGradeOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGradeSubmit} autoFocus>
                      Submit Grade
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button
                  variant="outlined"
                  onClick={() => setRequestMarkerOpen(true)}
                >
                  Request Third Marker
                </Button>
                <Dialog
                  open={requestMarkerOpen}
                  onClose={() => setRequestMarkerOpen(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Request a Third Marker?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      This will inform the admin to fill in a third marker.
                      Ensure this has been agreed with the other marker before
                      accepting.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setRequestMarkerOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={requestThirdMarkerHandler} autoFocus>
                      Request Third Marker
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
            <br></br>
            {loadingSubmit && <ClipLoader size={150} />}
          </div>
        )
      ) : (
        <div>
          {currentPaper.status == "Second Resolution" ? (
            <p>Could not reach final grade. Requested third marker.</p>
          ) : null}
          {currentPaper.status != "Second Resolution" &&
          currentPaper.thirdMarkerID ? (
            <p>Could not reach final grade so a third marker was requested.</p>
          ) : null}
          {currentPaper.status != "Second Resolution" ? (
            <p>Resolution found, did not request a third marker.</p>
          ) : null}
        </div>
      )}
    </div>
  );
};
