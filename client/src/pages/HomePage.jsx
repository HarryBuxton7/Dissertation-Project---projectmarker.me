import React, { useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { TokenContext } from "../App";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import getPapersRequest from "../api/getPapersRequest";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { blue, grey } from "@mui/material/colors";
import getPapersFromCohortRequest from "../api/getPapersFromCohortRequest";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export const HomePage = () => {
  const [
    token,
    setToken,
    userID,
    setUserId,
    selectedCohort,
    setSelectedCohort,
    admin,
    setAdmin,
    cohorts,
    setCohorts,
    completed,
    setCompleted,
  ] = useContext(TokenContext);

  const queryClient = useQueryClient();

  const [clickedCompleted, setClickedCompleted] = useState(false);

  const { isLoading: loadingCohortPapers, data: cohortPapers } = useQuery(
    ["cohortPapers", selectedCohort],
    () => getPapersFromCohortRequest(token, selectedCohort),
    {
      enabled: selectedCohort !== null,
    }
  );

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleButtonClick = () => {
    if (completed) {
      setClickedCompleted(!clickedCompleted);
    } else {
      handleClickOpen();
    }
  };

  const { isLoading: loadingPapers, data: papers } = useQuery(
    "papers",
    () => getPapersRequest(token),
    {
      onSuccess: (paper) => {
        // Sort the papers
        paper.sort((a, b) => {
          if (a.status === "Completed" && b.status !== "Completed") return -1;
          if (b.status === "Completed" && a.status !== "Completed") return 1;
          // If the status is the same, compare by name
          return a.studentName.localeCompare(b.studentName);
        });

        // Update the cache with the sorted papers
        queryClient.setQueryData("papers", paper);

        // Your existing cohort logic
        let cohortMap = new Map();
        paper.forEach((paper) => {
          let date = paper.projectInspectionDate.slice(-2);
          let type = paper.projectType;
          let cohortType = `My ${type} projects 20${date}`;
          paper.cohort = cohortType;
          cohortMap.set(cohortType, cohortType);
        });

        let cohortsArray = [...cohortMap.keys()];
        cohortsArray.sort(projectComparator);
        setCohorts(cohortsArray);

        if (selectedCohort == null) {
          console.log("null");
          setSelectedCohort(cohortsArray[0]);
          let completed = true;
          if (papers && Array.isArray(papers)) {
            for (let paper of papers) {
              if (
                paper.cohort === cohortsArray[0] &&
                paper.status !== "Completed"
              ) {
                completed = false;
                break;
              }
            }
          }
          console.log("completed1");
          console.log(completed);
          setCompleted(completed);
        }
      },
    }
  );

  useEffect(() => {
    if (papers && Array.isArray(papers)) {
      papers.forEach((paper) => {
        let date = paper.projectInspectionDate.slice(-2);
        let type = paper.projectType;
        let cohortType = `My ${type} projects 20${date}`;
        paper.cohort = cohortType;
      });

      let completed = true;
      for (let paper of papers) {
        console.log(paper.studentName);
        if (paper.cohort === selectedCohort && paper.status !== "Completed") {
          completed = false;
          break;
        }
      }
      console.log("completed2");
      console.log(completed);
      setCompleted(completed);
    }
  }, []);

  function projectComparator(a, b) {
    // Extract years from the strings.
    const yearA = parseInt(a.split(" ").slice(-1)[0]);
    const yearB = parseInt(b.split(" ").slice(-1)[0]);

    // Compare by year first.
    if (yearA !== yearB) {
      return yearB - yearA; // Sort descending by year.
    }

    // If years are same, compare by project type.
    const order = {
      MSc: 1,
      "MSc Conversion": 2,
      BSc: 3,
    };

    const typeA = a.includes("MSc Conversion")
      ? "MSc Conversion"
      : a.split(" ")[1];
    const typeB = b.includes("MSc Conversion")
      ? "MSc Conversion"
      : b.split(" ")[1];

    return order[typeA] - order[typeB];
  }

  function getCellColor(cellColumn, paper, hover) {
    let defaultHover = "rgba(128, 128, 128, 0.1)";
    let red = "rgba(255, 0, 0, 0.2)";
    let hoverRed = "rgba(255, 0, 0, 0.5)";
    let green = "rgba(0, 128, 0, 0.2)";
    let hoverGreen = "rgba(0, 128, 0, 0.5)";
    let grey = "rgba(128, 128, 128, 0.2)";
    let hoverGrey = "rgba(128, 128, 128, 0.5)";
    let yellow = "rgba(255, 255, 0, 0.2)";
    let hoverYellow = "rgba(255, 255, 0, 0.5)";
    if (userID == paper.thirdMarkerID && cellColumn == paper.status) {
      if (cellColumn == "Second Resolution") {
        return hover ? hoverYellow : yellow;
      }
      return hover ? hoverGrey : grey;
    }
    if (cellColumn == paper.status) {
      if (cellColumn == "Project Inspection") {
        if (paper.secondMarkerID == userID) {
          if (hover == true) {
            return hoverGreen;
          }
          return green;
        } else if (paper.firstMarkerID == userID) {
          if (hover == true) {
            return hoverGrey;
          }
          return grey;
        }
      }
      if (cellColumn == "Final Demonstration") {
        if (paper.secondMarkerID == userID) {
          if (hover == true) {
            return hoverGreen;
          }
          return green;
        } else if (paper.firstMarkerID == userID) {
          if (hover == true) {
            return hoverGrey;
          }
          return grey;
        }
      }
      if (cellColumn == "Initial Blind Marking") {
        if (paper.secondMarkerID == userID) {
          if (!paper.secondMarkerGrade) {
            if (hover == true) {
              return hoverGreen;
            }
            return green;
          } else {
            if (hover == true) {
              return hoverGrey;
            }
            return grey;
          }
        } else if (paper.firstMarkerID == userID) {
          if (!paper.firstMarkerGrade) {
            if (hover == true) {
              return hoverGreen;
            }
            return green;
          } else {
            if (hover == true) {
              return hoverGrey;
            }
            return grey;
          }
        }
      }
      if (cellColumn == "Supervisor Feedback") {
        if (paper.firstMarkerID == userID) {
          if (hover == true) {
            return hoverGreen;
          }
          return green;
        } else if (paper.secondMarkerID == userID) {
          if (hover == true) {
            return hoverGrey;
          }
          return grey;
        }
      }
      if (cellColumn == "First Resolution") {
        if (hover == true) {
          return hoverGreen;
        }
        return green;
      }
      if (cellColumn == "Second Resolution") {
        if (!paper.thirdMarkerGrade) {
          if (hover == true) {
            return hoverGrey;
          }
          return grey;
        }
        if (hover == true) {
          return hoverGreen;
        }
        return green;
      }
    }

    if (hover == true) {
      return defaultHover;
    } else {
      return null;
    }

    //project inspection
    //final inspection
    //initial blind marking
    //1st resolution
    //2nd resolution
    //feedback from supervisor
    //final mark
  }

  const navigate = useNavigate();

  const [age, setAge] = React.useState(10);

  return (
    <div>
      <br></br>
      <h1>Projects In Progress</h1>
      {loadingPapers ? (
        <ClipLoader size={150} />
      ) : (
        <div>
          {cohorts.length > 0 ? (
            <div>
              <br></br>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label">
                  Choose Cohort
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCohort ? selectedCohort : ""}
                  label="Choose Cohort"
                  onChange={(e) => {
                    setSelectedCohort(e.target.value);
                    let completed = true;
                    for (let paper of papers) {
                      if (
                        paper.cohort === e.target.value &&
                        paper.status !== "Completed"
                      ) {
                        completed = false;
                        break;
                      }
                    }
                    completed ? setCompleted(true) : setCompleted(false);
                    setClickedCompleted(false);
                  }}
                >
                  {cohorts.map((cohort, index) => (
                    <MenuItem key={index} value={cohort}>
                      {cohort}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : null}

          <br></br>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundColor: "rgba(0, 128, 0, 0.8)",
                marginRight: 1,
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2" sx={{ marginRight: 3 }}>
              Green = Requires action
            </Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundColor: "rgba(255, 0, 0, 0.8)",
                marginRight: 1,
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2" sx={{ marginRight: 3 }}>
              Red = Behind deadline
            </Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundColor: "rgba(128, 128, 128, 0.8)",
                marginRight: 1,
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2" sx={{ marginRight: 3 }}>
              Grey = Waiting for action from others
            </Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundColor: "rgba(255, 255, 0, 0.8)",
                marginRight: 1,
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2">
              Yellow = Requires action as third marker
            </Typography>
          </Box>
          <br></br>

          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Student Info</TableCell>
                  <TableCell>Degree Program Info</TableCell>
                  <TableCell>Project Inspection</TableCell>
                  <TableCell>Final Demonstration</TableCell>
                  {papers.some(
                    (paper) =>
                      paper.cohort === selectedCohort &&
                      (paper.status === "Initial Blind Marking" ||
                        paper.status === "First Resolution" ||
                        paper.status === "Second Resolution" ||
                        paper.status === "Supervisor Feedback" ||
                        paper.status === "Completed")
                  ) && <TableCell>Initial Blind Marking</TableCell>}
                  {papers.some(
                    (paper) =>
                      paper.cohort === selectedCohort &&
                      paper.status === "First Resolution"
                  ) && (
                    <TableCell>Resolution Between 1st and 2nd marker</TableCell>
                  )}
                  {papers.some(
                    (paper) =>
                      paper.cohort === selectedCohort &&
                      paper.status === "Second Resolution"
                  ) && <TableCell>Resolution Between 3 markers</TableCell>}
                  {papers.some(
                    (paper) =>
                      paper.cohort === selectedCohort &&
                      (paper.status === "Supervisor Feedback" ||
                        paper.status === "Completed")
                  ) && <TableCell>Supervisor Feedback</TableCell>}
                  <TableCell>Final Mark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {papers.map(
                  (paper, index) =>
                    selectedCohort == paper.cohort ? ( // condition you want to check
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {`Student: ${paper.studentName}`}
                          <br></br>
                          <br></br>
                          {`Supervisor: ${paper.firstMarkerName}`}
                        </TableCell>
                        <TableCell>
                          {`Degree Program: ${paper.degreeProgramme}`}
                          <br></br>
                          <br></br>
                          {`Project Type: ${paper.projectType}`}
                        </TableCell>
                        <TableCell
                          hover={true}
                          onClick={(e) =>
                            navigate(`/ProjectInspection/${paper._id}`)
                          }
                          sx={{
                            "&:hover": {
                              backgroundColor: getCellColor(
                                "Project Inspection",
                                paper,
                                true
                              ),
                            },
                            cursor: "pointer",
                            backgroundColor: getCellColor(
                              "Project Inspection",
                              paper,
                              false
                            ),
                          }}
                        >
                          {`Project Inspector: ${paper.secondMarkerName}`}
                          <br></br>
                          <br></br>
                          {`Project Inspection Date: ${paper.projectInspectionDate}`}
                        </TableCell>
                        <TableCell
                          hover={true}
                          onClick={(e) =>
                            navigate(`/ProjectDemonstration/${paper._id}`)
                          }
                          sx={{
                            "&:hover": {
                              backgroundColor: getCellColor(
                                "Final Demonstration",
                                paper,
                                true
                              ),
                            },
                            cursor: "pointer",
                            backgroundColor: getCellColor(
                              "Final Demonstration",
                              paper,
                              false
                            ),
                          }}
                        >
                          {`Assessor Name: ${paper.secondMarkerName}`}
                          <br></br>
                          <br></br>
                          {`Final Demonstration Date: ${paper.finalDemonstrationDate}`}
                        </TableCell>
                        {papers.some(
                          (paper) =>
                            paper.cohort === selectedCohort &&
                            (paper.status === "Initial Blind Marking" ||
                              paper.status === "First Resolution" ||
                              paper.status === "Second Resolution" ||
                              paper.status === "Supervisor Feedback" ||
                              paper.status === "Completed")
                        ) && (
                          <TableCell
                            hover={true}
                            onClick={(e) =>
                              navigate(`/BlindMarking/${paper._id}`)
                            }
                            sx={{
                              "&:hover": {
                                backgroundColor: getCellColor(
                                  "Initial Blind Marking",
                                  paper,
                                  true
                                ),
                              },
                              cursor: "pointer",
                              backgroundColor: getCellColor(
                                "Initial Blind Marking",
                                paper,
                                false
                              ),
                            }}
                          >
                            {paper.firstMarkerID === userID &&
                            !paper.firstMarkerGrade &&
                            paper.status === "Initial Blind Marking" ? (
                              <p>Requires grading</p>
                            ): null}
                            {paper.secondMarkerID === userID &&
                            !paper.secondMarkerGrade &&
                            paper.status === "Initial Blind Marking" ? (
                              <p>Requires grading</p>
                            ): null}
                            {paper.firstMarkerID === userID &&
                            paper.firstMarkerGrade &&
                            paper.status === "Initial Blind Marking" ? (
                              <p>Waiting for other marker to grade</p>
                            ): null}
                            {paper.secondMarkerID === userID &&
                            paper.secondMarkerGrade &&
                            paper.status === "Initial Blind Marking" ? (
                              <p>Waiting for other marker to grade</p>
                            ): null}
                          </TableCell>
                        )}
                        {papers.some(
                          (paper) =>
                            paper.cohort === selectedCohort &&
                            paper.status === "First Resolution"
                        ) && (
                          <TableCell
                            hover={true}
                            onClick={(e) =>
                              navigate(`/FirstResolution/${paper._id}`)
                            }
                            sx={{
                              "&:hover": {
                                backgroundColor: getCellColor(
                                  "First Resolution",
                                  paper,
                                  true
                                ),
                              },
                              cursor: "pointer",
                              backgroundColor: getCellColor(
                                "First Resolution",
                                paper,
                                false
                              ),
                            }}
                          >
                            {paper.status === "First Resolution" && <p>Needs Resolving</p>}
                          </TableCell>
                        )}
                        {papers.some(
                          (paper) =>
                            paper.cohort === selectedCohort &&
                            paper.status === "Second Resolution"
                        ) && (
                          <TableCell
                            hover={true}
                            onClick={(e) =>
                              navigate(`/SecondResolution/${paper._id}`)
                            }
                            sx={{
                              "&:hover": {
                                backgroundColor: getCellColor(
                                  "Second Resolution",
                                  paper,
                                  true
                                ),
                              },
                              cursor: "pointer",
                              backgroundColor: getCellColor(
                                "Second Resolution",
                                paper,
                                false
                              ),
                            }}
                          >
                            {paper.status == "Completed" ? (
                              <p>Graded & resolved</p>
                            ) : null}
                            {paper.status == "Second Resolution" &&
                            !paper.thirdMarkerID ? (
                              <p>Waiting for third marker</p>
                            ) : null}
                            {paper.status == "Second Resolution" &&
                            paper.thirdMarkerID &&
                            paper.thirdMarkerID !== userID &&
                            !paper.thirdMarkerGrade ? (
                              <p>Waiting for third marker grade</p>
                            ) : null}
                                                        {paper.status == "Second Resolution" &&
                            paper.thirdMarkerID &&
                            paper.thirdMarkerID !== userID &&
                            paper.thirdMarkerGrade ? (
                              <p>Requires final grading decision</p>
                            ) : null}
                            {
                              paper.thirdMarkerID === userID 
                                ? (!paper.thirdMarkerGrade 
                                    ? <p>Requires third marker grade</p> 
                                    : <p>Requires final grading decision</p>) 
                                : null
                            }

                          </TableCell>
                        )}
                        {papers.some(
                          (paper) =>
                            paper.cohort === selectedCohort &&
                            (paper.status === "Supervisor Feedback" ||
                              paper.status === "Completed")
                        ) && (
                          <TableCell
                            hover={true}
                            onClick={(e) =>
                              navigate(`/SupervisorFeedback/${paper._id}`)
                            }
                            sx={{
                              "&:hover": {
                                backgroundColor: getCellColor(
                                  "Supervisor Feedback",
                                  paper,
                                  true
                                ),
                              },
                              cursor: "pointer",
                              backgroundColor: getCellColor(
                                "Supervisor Feedback",
                                paper,
                                false
                              ),
                            }}
                          >{`Feedback from Supervisor: ${paper.firstMarkerName}`}</TableCell>
                        )}
                        <TableCell>
                          {paper.finalGrade ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <CheckCircleIcon
                                style={{
                                  color:
                                    (selectedCohort
                                      ?.toUpperCase()
                                      .includes("BSC") &&
                                      paper.finalGrade < 40) ||
                                    (!selectedCohort
                                      ?.toUpperCase()
                                      .includes("BSC") &&
                                      paper.finalGrade < 50)
                                      ? "red"
                                      : "green",
                                }}
                              />
                              <span>{paper.finalGrade}</span>
                            </div>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ) : null // return null if condition is false
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <br></br>
          <Button
            variant="contained"
            onClick={handleButtonClick}
            sx={{
              backgroundColor: completed ? blue[500] : grey[500],
              "&:hover": {
                backgroundColor: completed ? blue[700] : grey[700],
              },
              width: 250,
            }}
          >
            {clickedCompleted === false
              ? "Show Completed Papers"
              : "Hide Completed Papers"}
          </Button>

          {/* MUI Dialog */}
          <Dialog
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            open={open}
          >
            <DialogTitle id="alert-dialog-title"></DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                You can only see all student marks when your marking for this
                cohort is completed!
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          {clickedCompleted && (
            <>
              {loadingCohortPapers ? (
                <ClipLoader size={150} />
              ) : (
                <div>
                  {cohortPapers && cohortPapers.length > 0 ? (
                    <div>
                      <br></br>
                      <TableContainer component={Paper} sx={{ width: "100%" }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>DegreeProgramme</TableCell>
                              <TableCell>Student Name</TableCell>
                              <TableCell>Supervisors</TableCell>
                              <TableCell>Canvas Link</TableCell>
                              <TableCell>Final Mark</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[...cohortPapers]
                              .filter(
                                (paper) =>
                                  paper.finalGrade !== undefined &&
                                  !isNaN(parseFloat(paper.finalGrade))
                              ) // Filtering out papers without a finalGrade
                              .sort((a, b) => {
                                const gradeA = parseFloat(a.finalGrade);
                                const gradeB = parseFloat(b.finalGrade);

                                return gradeB - gradeA;
                              })
                              .map((paper, index) => {
                                return (
                                  <TableRow
                                    key={paper._id}
                                    sx={{
                                      backgroundColor:
                                        paper.firstMarkerID === userID ||
                                        paper.secondMarkerID === userID ||
                                        paper.thirdMarkerID === userID
                                          ? "rgba(0, 128, 0, 0.2)"
                                          : "inherit",
                                    }}
                                  >
                                    <TableCell>
                                      {paper.degreeProgramme}
                                    </TableCell>
                                    <TableCell>{paper.studentName}</TableCell>
                                    <TableCell>{paper.supervisors}</TableCell>
                                    <TableCell>
                                      <a
                                        href={paper.linkToCanvasDownload}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Canvas Link
                                      </a>
                                    </TableCell>
                                    <TableCell>{paper.finalGrade}</TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  ) : (
                    <button onClick={() => console.log(cohortPapers)}>
                      Log
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
