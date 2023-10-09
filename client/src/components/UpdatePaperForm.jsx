import { useParams } from "react-router-dom"
import { useState, useContext, useEffect } from "react";
import { useQueryClient, useMutation } from 'react-query';
import { TokenContext } from '../App';
import updatePaperRequest from "../api/updatePaperRequest";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ClipLoader from 'react-spinners/ClipLoader';
import { set } from "lodash";
import { useNavigate } from 'react-router-dom';

export const UpdatePaperForm = () => {
    let { fileID } = useParams();
    const [grade, setGrade] = useState()
    const [comment, setComment] = useState()
    const [token, setToken, userID, setUserId, selectedCohort, setSelectedCohort] = useContext(TokenContext);
    const queryClient = useQueryClient();
    const [currentPaper, setCurrentPaper] = useState()
    const [role, setRole] = useState("")
    const navigate = useNavigate();


    useEffect(()=> {
      let paperList = queryClient.getQueryData("papers")
      let thisUrlPaper
      for (let i in paperList){
        if (paperList[i].fileID == fileID){
          thisUrlPaper = paperList[i]
        }
      }
      setCurrentPaper(thisUrlPaper)
      if (thisUrlPaper.firstMarkerID == userID){
        setGrade(thisUrlPaper.firstMarkerGrade)
        setComment(thisUrlPaper.firstMarkerComment)
        setRole("firstMarker")
      } else if (thisUrlPaper.secondMarkerID == userID){
        setGrade(thisUrlPaper.secondMarkerGrade)
        setComment(thisUrlPaper.secondMarkerComment)
        setRole("secondMarker")
      }
    },[])
  
  const { mutate: updatePaper } = useMutation(
    (updatedPaper) => updatePaperRequest(updatedPaper, token),
    {
      onSettled: () => {
        queryClient.invalidateQueries('papers')
      },
    }
  );

  async function submitGradeHandler(e){
    e.preventDefault()
    let tempPaper = currentPaper
    if (role == "firstMarker"){
      tempPaper.firstMarkerGrade = grade
    } else if (role == "secondMarker"){
      tempPaper.secondMarkerGrade = grade
    }
    await updatePaper(tempPaper, token)
    navigate("/")
  }
  async function downloadHandler(e){
    const response = await fetch(`http://localhost:8080/file/${currentPaper.fileID}`, {
      method: 'GET'
    })
    const blob = await response.blob()
    const contentType = response.headers.get("content-type");
    const disposition = response.headers.get("Content-Disposition");
    let fileName = disposition.match(/filename="(.*)"/)[1];
    fileName = fileName.split(".")
    let fileExtension;
    switch (contentType) {
      case "application/pdf":
          fileExtension = ".pdf";
          break;
      case "text/plain":
          fileExtension = ".txt";
          break;
    }
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName[0]}`); // Use the correct file extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

    return (
        <div>
            {!currentPaper ? (
              <ClipLoader size={150} />
            ) : (
              <div>
                <h2>Your comment for other markers:</h2>
                <form autoComplete="off" onSubmit={submitGradeHandler}>
                <TextField 
              id="outlined-basic" 
              variant="outlined"
              label="Enter Comment"
              type="text"
              fullWidth 
              multiline
              value={role == "firstMarker" ? currentPaper.firstMarkerComment: currentPaper.secondMarkerComment}
              onChange = {(e) => {
                let tempPaper = currentPaper
                if (role == "firstMarker"){
                  tempPaper.firstMarkerComment = e.target.value
                } else if (role == "secondMarker"){
                  tempPaper.secondMarkerComment = e.target.value
                }
                updatePaper(tempPaper)
              }}
            />
            <br/>
            <br/>
            <h2>Your feedback for the student:</h2>
            <TextField 
              id="outlined-basic" 
              variant="outlined"
              label="Enter Feedback"
              type="text"
              fullWidth 
              multiline
              value={role == "firstMarker" ? currentPaper.firstMarkerFeedback: currentPaper.secondMarkerFeedback}
              onChange = {(e) => {
                let tempPaper = currentPaper
                if (role == "firstMarker"){
                  tempPaper.firstMarkerFeedback = e.target.value
                } else if (role == "secondMarker"){
                  tempPaper.secondMarkerFeedback = e.target.value
                }
                updatePaper(tempPaper)
              }}
            />
            <br/>
            <br/>
            <h2>Your grade:</h2>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Enter Grade"
              type="number"
              value={grade}
              onChange = {(e) => {
                if (e.target.value.length < 3 || e.target.value == "100") {
                  setGrade(e.target.value)
                }
              }}
            />
            <br/>
            <br/>
            <Button variant="contained" type="submit">Submit Grade</Button>
            </form>
            <br/>
            <br/>
                <Button variant="contained" onClick = {downloadHandler}>{`download ${currentPaper.fileName}`}</Button>
              </div>
            )}
        </div>
    )
}