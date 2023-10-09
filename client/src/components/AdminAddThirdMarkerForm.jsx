import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { TokenContext } from "../App";
import updatePaperRequest from "../api/updatePaperRequest";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import getUsersRequest from "../api/getUsersRequest";
import getPaperRequest from "../api/getPaperRequest";
import Autocomplete from "@mui/material/Autocomplete";

export const AdminAddThirdMarkerForm = () => {
  let { fileID } = useParams();
  const [currentPaper, setCurrentPaper] = useState();
  const [thirdMarker, setThirdMarker] = useState("");
  const [userList, setUserList] = useState([]);

  const [
    token,
    setToken,
    userID,
    setUserId,
    selectedCohort,
    setSelectedCohort,
  ] = useContext(TokenContext);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data: users } = useQuery("users", () => getUsersRequest(token));

  useQuery("paper", () => getPaperRequest(token, fileID), {
    onSettled: (paper) => {
      setCurrentPaper(paper);
    },
  });

  useEffect(() => {
    if (currentPaper) { // You can add any comparison logic with currentPaper here
      setUserList([]);
      users?.forEach((user) => {
        if (user.email != undefined && user._id !== currentPaper.firstMarkerID && user._id !== currentPaper.secondMarkerID && user._id !== currentPaper.thirdMarkerID) {
          setUserList((prev) => [...prev, { label: user.email }]);
        }
      });
    }
  }, [currentPaper, users]); // Re-run effect when currentPaper or users changes

  const { mutate: updatePaper } = useMutation(
    (updatedPaper) => updatePaperRequest(updatedPaper, token),
    {
      onSettled: (paper, _, variables) => {
        queryClient.invalidateQueries("papers");
        if (variables.actionType === "submitThirdMarker") {
          navigate("/admin");
        }
      },
    }
  );
  
  function submitThirdMarkerHandler(e) {
    e.preventDefault();
    let tempPaper = currentPaper;
    tempPaper.thirdMarkerEmail = thirdMarker;
  
    try {
      updatePaper({
        ...tempPaper,
        actionType: "submitThirdMarker",
      }, token); // Assuming token is needed here as per your original code
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1>Admin Add Third Marker</h1>
      <form autoComplete="off" onSubmit={submitThirdMarkerHandler}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={userList}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              type="search"
              label="Enter First Marker Email"
            />
          )}
          onChange={(e, newValue) =>
            setThirdMarker(newValue ? newValue.label : "")
          }
        />
        <br></br>
        <br></br>
        <Button variant="contained" type="submit">
          Assign Third Marker
        </Button>
      </form>
    </div>
  );
};
