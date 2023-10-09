import React, { useContext, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import uploadFileRequest from "../api/uploadFileRequest";
import getUsersRequest from "../api/getUsersRequest";
import { TokenContext } from "../App";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import uploadCSVRequest from "../api/uploadCSVRequest";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const UploadPaperForm = () => {
  const [studentID, setStudentID] = useState("");
  const [firstMarker, setFirstMarker] = useState("");
  const [secondMarker, setSecondMarker] = useState("");

  const [token, setToken, userID, setUserId, selectedCohort, setSelectedCohort] = useContext(TokenContext);
  const [inputtedFile, setInputtedFile] = useState();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);

  const { mutate: uploadFile } = useMutation(
    (formData) => uploadFileRequest(formData, token),
    {
      onSettled: () => {
        queryClient.invalidateQueries("papers");
        navigate("/");
      },
    }
  );

  const { isLoading: loadingUsers, data: users } = useQuery(
    "users",
    () => getUsersRequest(token),
    {
      onSettled: (data) => {
        setUserList([]);
        data.forEach((user) => {
          if (user.email != undefined) {
            setUserList((prev) => [...prev, { label: user.email }]);
          }
        });
      },
    }
  );

  function fileUploadHandler(e) {
    e.preventDefault();
    if (
      studentID === "" ||
      firstMarker === "" ||
      secondMarker === "" ||
      inputtedFile === undefined
    ) {
      alert("Please fill in all fields");
      return;
    }
    let firstMarkerID;
    let secondMarkerID;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == firstMarker) {
        firstMarkerID = users[i]._id;
      }
      if (users[i].email == secondMarker) {
        secondMarkerID = users[i]._id;
      }
    }

    const formData = new FormData();
    formData.append("file", inputtedFile);
    formData.append("fileName", inputtedFile.name);
    formData.append("studentID", studentID);
    formData.append("firstMarkerID", firstMarkerID);
    formData.append("firstMarkerEmail", firstMarker);
    formData.append("secondMarkerID", secondMarkerID);
    formData.append("secondMarkerEmail", secondMarker);
    uploadFile(formData);
  }

  const { mutate: uploadCSV } = useMutation(
    (formData) => uploadCSVRequest(formData, token),
    {
      onSettled: () => {
        queryClient.invalidateQueries("papers");
        navigate("/admin");
      },
    }
  );

  function uploadCSVHandler(e) {
    e.preventDefault();
    if (inputtedFile === undefined) {
      alert("Please select a file");
      return;
    }
    if (inputtedFile.type !== "text/csv") {
      alert("Please select a CSV file");
      return;
    }
    const formData = new FormData();
    formData.append("file", inputtedFile);
    uploadCSV(formData);
  }

  const rows = [
    {
      projectType: 'BSc',
      supervisors: 'Harry',
      studentName: 'Alice Smith',
      studentID: '11111',
      degreeProgramme: 'Data Science',
      projectType: 'Conversion BSc',
      projectInspectionDate: '08/6/2023',
      finalDemonstrationDate: '02/8/2023',
      submissionDate: '18/8/2023',
      firstMarkerName: 'John Doe',
      firstMarkerEmail: '1@1',
      secondMarkerName: 'Jane Doe',
      secondMarkerEmail: '2@2',
      linkToCanvasDownload: 'www.canvas.com/link1',
    },
  ];

  return (
    <div>
      <form autoComplete="off" onSubmit={uploadCSVHandler}>
        <h1>Upload a CSV:</h1>
        <TextField
          id="outlined-basic"
          variant="outlined"
          type="file"
          onChange={(e) => setInputtedFile(e.target.files[0])}
        />
        <br></br>
        <br></br>
        <Button variant="contained" type="submit">
          Upload CSV
        </Button>
      </form>
      <h1>Example Table for CSV file:</h1>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="project table">
        <TableHead>
          <TableRow>
            <TableCell>Supervisors</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Student ID</TableCell>
            <TableCell>Degree Programme</TableCell>
            <TableCell>Project Type</TableCell>
            <TableCell>Project Inspection Date</TableCell>
            <TableCell>Final Demonstration Date</TableCell>
            <TableCell>Submission Date</TableCell>
            <TableCell>First Marker Name</TableCell>
            <TableCell>First Marker Email</TableCell>
            <TableCell>Second Marker Name</TableCell>
            <TableCell>Second Marker Email</TableCell>
            <TableCell>Link to Canvas Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.supervisors}</TableCell>
              <TableCell>{row.studentName}</TableCell>
              <TableCell>{row.studentID}</TableCell>
              <TableCell>{row.degreeProgramme}</TableCell>
              <TableCell>{row.projectType}</TableCell>
              <TableCell>{row.projectInspectionDate}</TableCell>
              <TableCell>{row.finalDemonstrationDate}</TableCell>
              <TableCell>{row.submissionDate}</TableCell>
              <TableCell>{row.firstMarkerName}</TableCell>
              <TableCell>{row.firstMarkerEmail}</TableCell>
              <TableCell>{row.secondMarkerName}</TableCell>
              <TableCell>{row.secondMarkerEmail}</TableCell>
              <TableCell>{row.linkToCanvasDownload}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};
