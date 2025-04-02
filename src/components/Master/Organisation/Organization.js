import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Table,
  TableBody,
  AppBar,
  Toolbar,
  Typography,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
} from "@mui/material";
import LoadingBar from "react-top-loading-bar";
import SearchIcon from "@mui/icons-material/Search";
import base64 from "base64-js";
import Tooltip from "@mui/material/Tooltip";

const Organization = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [authorization, setAuthorization] = useState([]);
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming user can edit
  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
  console.log(formId);

  const handleAddOrganization = () => {
    navigate("/addOrganization");
    console.log("Navigate to Add Organization page");
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchOrganizationData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Organization/GetOrganization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        console.error("Account name incorrect");
        alert("Invalid account name");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const Authorizer = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/CPanel/Module_Authorizer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          formId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setAuthorization(responseData);
        const authorizationData = responseData[0];
        setCanEdit(authorizationData.uModify === 1);
      } else {
        console.error("Country name incorrect");
        alert("Invalid country name");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    fetchOrganizationData();
    Authorizer();
  }, []);

  return (
    <div className="container mt-4">
      <LoadingBar
        progress={loadingBarProgress}
        color="rgb(152, 106, 182)"
        height={5}
      />
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Organization
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={3}
        style={{ padding: 16, width: "100%", margin: "auto", marginTop: 16 }}
      >
        <div className="container mt-4">
          <div
            className="container mt-2"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: { padding: "0px 8px" },
              }}
              sx={{
                width: 300,
                backgroundColor: "#f9f9f9",
              }}
            />
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Organization Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Email-Id</b>
                  </TableCell>
                  <TableCell>
                    <b>Mobile No.</b>
                  </TableCell>
                  <TableCell>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.schoolId}>
                    <TableCell>{row.schoolName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.mobileNo}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={canEdit ? "" : "You are not authorized to edit"}
                        arrow
                      >
                        <span>
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() =>
                              navigate(`/editOrganization/${row.schoolId}`, {
                                state: { encodedFormId }, // Pass encodedFormId
                              })
                            }
                            disabled={!canEdit}
                          >
                            Edit
                          </Button>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
    </div>
  );
};

export default Organization;
