import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { TokenContext } from "../App";
import getPapersRequest from "../api/getPapersRequest";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export const AdminHomePage = () => {
  const [
    token,
    setToken,
    userID,
    setUserId,
    selectedCohort,
    setSelectedCohort,
    admin,
    setAdmin,
  ] = useContext(TokenContext);

  const queryClient = useQueryClient();

  const { isLoading: loadingAdminPapers, data: adminPapers } = useQuery(
    "adminPapers",
    () => getPapersRequest(token),
    {
      onSettled: (paper) => {
        console.log(paper);
      },
    }
  );

  const columns = [
    {
      field: "submissionDate",
      headerName: "Year",
      width: 100, // years will generally be 4 characters like "2023"
      valueGetter: (params) => {
        const year = params.value.split("/")[2];
        return year;
      },
    },
    {
      field: "projectType",
      headerName: "Cohort",
      width: 150, // assuming cohort names might be medium length
    },
    {
      field: "degreeProgramme",
      headerName: "DegreeProgramme",
      width: 250, // degree names can be longer
    },
    {
      field: "studentName",
      headerName: "Student Name",
      width: 200, // first name + last name
    },
    {
      field: "supervisors",
      headerName: "Supervisors",
      width: 250, // assuming multiple supervisors
    },
    {
      field: "status",
      headerName: "Status",
      width: 150, // common status like "Completed", "In Progress"
    },
    {
      field: "finalGrade",
      headerName: "Final Mark",
      width: 120, // marks like "85%"
    },
  ];

  const filteredAdminPapers = adminPapers
    ? adminPapers.filter(
        (paper) => !paper.thirdMarkerID && paper.status == "Second Resolution"
      )
    : [];

  const navigate = useNavigate();

  return (
    <div>
      <br></br>
      <br></br>
      <Button variant="contained" onClick={() => navigate("/upload")}>
        Upload Project
      </Button>
      <h1>All Projects:</h1>
      <Box
        sx={{
          height: 474.44,
          width: "100%",
          ".MuiDataGrid-row": {
            "&:hover": {
              cursor: "pointer",
            },
          },
        }}
      >
        {loadingAdminPapers ? (
          <ClipLoader />
        ) : (
          <DataGrid
            rows={adminPapers || []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            getRowId={(row) => row._id} // add this line
            onRowClick={(params, event) => navigate(`/paper/${params.id}`)} // add this line
          />
        )}
      </Box>
      <h1>Need Third Marker Assigned:</h1>
      <Box sx={{ height: 370.43, width: "100%" }}>
        {loadingAdminPapers ? (
          <ClipLoader />
        ) : filteredAdminPapers.length > 0 ? (
          <DataGrid
            rows={filteredAdminPapers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick //add
            getRowId={(row) => row._id} // add this line
            onRowClick={(params, event) =>
              navigate(`/AddThirdMarker/${params.id}`)
            }
          />
        ) : (
          <div>No third markers required to be assigned.</div>
        )}
      </Box>
    </div>
  );
};
