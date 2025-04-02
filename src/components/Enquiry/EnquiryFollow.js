import {
  Container,
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

function EnquiryFollow() {
  const [followUpType, setFollowUpType] = useState("");
  const [showDateFields, setShowDateFields] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [enquiryData, setEnquiryData] = useState([]);
  const [error, setError] = useState(null);
  const [trackedThrough, setTrackedThrough] = useState("");
  const [status, setStatus] = useState("");
  const [loadingBarProgress, setLoadingBarProgress] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const statusOptions = [
    "Super Hot",
    "Very Hot",
    "Hot",
    "Cold",
    "Very Cold",
    "Lost",
    "Converted",
  ];

  useEffect(() => {
    fetchAssignedToOptions();
  }, []);

  useEffect(() => {
    if (followUpType && followUpType !== "SelectDate") {
      handleSearch();
    }
  }, [followUpType]);

  const formatDateForFetch = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatDateForInsert = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFollowUpTypeChange = (event) => {
    const selectedType = event.target.value;
    setFollowUpType(selectedType);
    setShowDateFields(selectedType === "SelectDate");
    setEnquiryData([]);
    setError(null);
  };

  const fetchAssignedToOptions = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Enquiry/ddlTeacher`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(
          `Error fetching assigned to options: ${response.status}`
        );
      }
      const data = await response.json();
      setAssignedToOptions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const mmddyyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (mmddyyyyRegex.test(dateString)) return dateString;
    const date = new Date(dateString);
    if (!isNaN(date)) {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return `${parts[1].padStart(2, "0")}/${parts[0].padStart(2, "0")}/${
        parts[2]
      }`;
    }
    return dateString;
  };

  const handleSearch = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/EnquiryFollowUp/FetchFollowUpList`;
      const token = sessionStorage.getItem("token");
      let requestBody = {};

      switch (followUpType) {
        case "SelectDate":
          if (!fromDate || !toDate) {
            setError("Please select both From Date and To Date.");
            setEnquiryData([]);
            return;
          }
          requestBody = {
            ddlOption: followUpType,
            fromDate: formatDateForFetch(fromDate),
            toDate: formatDateForFetch(toDate),
          };
          break;
        case "AllCurrentDate":
        case "PendingFollowUp":
          requestBody = {
            ddlOption: followUpType,
            fromDate: formatDateForFetch(
              new Date().toISOString().split("T")[0]
            ),
            toDate: formatDateForFetch(new Date().toISOString().split("T")[0]),
          };
          break;
        default:
          requestBody = {
            ddlOption: followUpType,
            fromDate: "",
            toDate: "",
          };
          break;
      }

      console.log("Request Body:", requestBody); // Log the request payload

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json();
          console.log("Error Response:", errorData);
          if (errorData.msg === "Sorry! No record found!") {
            setEnquiryData([]);
            setError("No record found.");
            return;
          }
        }
        throw new Error(`Error fetching follow-up list: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData); // Log the full response

      // Handle the response data
      const data = Array.isArray(responseData.data)
        ? responseData.data
        : responseData; // Fallback to responseData if .data is not present
      console.log("Processed Data:", data); // Log the processed data

      if (data && data.length > 0) {
        setEnquiryData(data);
        setError(null);
      } else {
        setEnquiryData([]);
        setError("No data available");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Error fetching data. Please try again later.");
      setEnquiryData([]);
    }
  };

  const handleReset = () => {
    setFollowUpType("");
    setShowDateFields(false);
    setFromDate("");
    setToDate("");
    setEnquiryData([]);
    setError(null);
    setFormErrors({});
  };

  const handleTrackedThroughChange = (event) => {
    setTrackedThrough(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleAssignedToChange = (event) => {
    setAssignedTo(event.target.value);
  };

  const handleCheckboxChange = (event, index) => {
    const newData = [...enquiryData];
    newData[index].isChecked = event.target.checked;
    setEnquiryData(newData);
  };

  const handleDropdownChange = (event, key, index) => {
    const newData = [...enquiryData];
    newData[index][key] = event.target.value;
    setEnquiryData(newData);
  };

  const handleRemarksChange = (event, index) => {
    const newData = [...enquiryData];
    newData[index].remark = event.target.value;
    setEnquiryData(newData);
  };

  const handleNextFollowUpDateChange = (event, index) => {
    const newData = [...enquiryData];
    newData[index].nextFollowUpDate = event.target.value;
    setEnquiryData(newData);
  };

  const handleEyeClick = async (enquiryId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/EnquiryFollowUp/FollowUpRecordById`;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ enquiryId }),
      });
      if (!response.ok) {
        console.error(`Error fetching follow-up record: ${response.status}`);
      }
      const data = await response.json();
      setSelectedEnquiry(data[0]);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = () => {
    let errors = {};
    enquiryData.forEach((enquiry, index) => {
      if (enquiry.isChecked) {
        if (!enquiry.trackedThrough) {
          errors[`trackedThrough-${index}`] = "Follow Up is required";
        }
        if (!enquiry.status) {
          errors[`status-${index}`] = "Status is required";
        }
        if (!enquiry.assignedTo) {
          errors[`assignedTo-${index}`] = "Assigned To is required";
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoadingBarProgress(30);
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/EnquiryFollowUp/InsertFollowUp`;
      const token = sessionStorage.getItem("token");

      const checkedEnquiryData = enquiryData.filter(
        (enquiry) => enquiry.isChecked
      );

      const payload = checkedEnquiryData.map((enquiry) => {
        const formattedEnquiryDate = formatDateForInsert(enquiry.enquiryDate);
        const formattedFollowUpDate = formatDateForInsert(
          enquiry.nextFollowUpDate
        );
        return {
          enquiryDate: formattedEnquiryDate,
          followUpDate: formattedFollowUpDate,
          enquieryCode: String(enquiry.enquiryCode),
          parent_GurdianName: enquiry.parent_GaurdianName,
          mobileNo: enquiry.mobile,
          remark: enquiry.remark,
          followUpType: followUpType || "",
          status: enquiry.status,
          enquiryId: enquiry.enquiryId,
          assignId: enquiry.assignId,
        };
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        alert(`Error saving follow-up data: ${response.status}`);
      } else {
        setLoadingBarProgress(100);
        alert("Follow-up data saved successfully!");
        handleSearch();
      }
    } catch (error) {
      console.error(error);
      alert("Error saving follow-up data. Please try again later.");
    }
  };

  return (
    <Container>
      <form>
        <div>
          <input
            className="form-check-input"
            style={{ marginTop: "50px", marginLeft: "10px" }}
          />
        </div>

        <h1 style={{ marginTop: "70px" }}>Enquiry-Follow-Up</h1>

        <div className="col-md-5 my-3">
          <label htmlFor="inputState" className="form-label">
            Follow Up Type
          </label>
          <select
            id="inputState"
            className="form-select"
            value={followUpType}
            onChange={handleFollowUpTypeChange}
          >
            <option value="">Select Follow Up Type</option>
            <option value="SelectDate">Selected Date Wise</option>
            <option value="AllCurrentDate">Current Date</option>
            <option value="PendingFollowUp">Pending</option>
          </select>
        </div>

        {showDateFields && (
          <div className="row my-3">
            <div className="col-md-5">
              <label htmlFor="fromDate" className="form-label">
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="toDate" className="form-label">
                To Date
              </label>
              <input
                type="date"
                id="toDate"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-info btn-bg my-2"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {enquiryData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Enquiry Code</th>
                  <th>Parent Name</th>
                  <th>Mobile</th>
                  <th>Enquiry Date</th>
                  <th>Enquiry Follow Up Date</th>
                  <th style={{ width: "20%" }}>Follow Up</th>
                  <th style={{ width: "20%" }}>Status</th>
                  <th style={{ width: "20%" }}>Assigned To</th>
                  <th style={{ width: "40%" }}>Remarks</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {enquiryData.map((enquiry, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={enquiry.isChecked || false}
                        onChange={(event) => handleCheckboxChange(event, index)}
                      />
                    </td>
                    <td>{enquiry.enquiryCode || "N/A"}</td>
                    <td>{enquiry.parent_GaurdianName || "N/A"}</td>
                    <td>{enquiry.mobile || "N/A"}</td>
                    <td>{enquiry.enquiryDate || "N/A"}</td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={enquiry.nextFollowUpDate || ""}
                        onChange={(e) => handleNextFollowUpDateChange(e, index)}
                      />
                    </td>
                    <td>
                      <select
                        value={enquiry.trackedThrough || ""}
                        onChange={(event) =>
                          handleDropdownChange(event, "trackedThrough", index)
                        }
                        className="form-select"
                      >
                        <option value="">--Select--</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                      </select>
                      {enquiry.isChecked &&
                        formErrors[`trackedThrough-${index}`] && (
                          <p className="text-danger">
                            {formErrors[`trackedThrough-${index}`]}
                          </p>
                        )}
                    </td>
                    <td>
                      <select
                        value={enquiry.status || ""}
                        onChange={(event) =>
                          handleDropdownChange(event, "status", index)
                        }
                        className="form-select"
                      >
                        <option value="">Select Status</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status === "Super Hot" ? "Interested" : status}
                          </option>
                        ))}
                      </select>
                      {enquiry.isChecked && formErrors[`status-${index}`] && (
                        <p className="text-danger">
                          {formErrors[`status-${index}`]}
                        </p>
                      )}
                    </td>
                    <td>
                      <select
                        value={enquiry.assignedTo || ""}
                        onChange={(event) =>
                          handleDropdownChange(event, "assignedTo", index)
                        }
                        className="form-select"
                      >
                        <option value="">--Select--</option>
                        {assignedToOptions.map((option) => (
                          <option
                            key={option.userId}
                            value={option.employeeName}
                          >
                            {option.employeeName}
                          </option>
                        ))}
                      </select>
                      {enquiry.isChecked &&
                        formErrors[`assignedTo-${index}`] && (
                          <p className="text-danger">
                            {formErrors[`assignedTo-${index}`]}
                          </p>
                        )}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={enquiry.remark || ""}
                        onChange={(event) => handleRemarksChange(event, index)}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <FaEye
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleEyeClick(enquiry.enquiryId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info">
            No enquiries found for the selected criteria.
          </div>
        )}

        <div>
          <button
            type="button"
            className="btn btn-info my-2"
            onClick={handleSave}
          >
            Save
          </button>
          <input
            type="reset"
            className="btn btn-primary"
            value="Reset"
            style={{ marginLeft: "15px" }}
            onClick={handleReset}
          />
        </div>
      </form>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enquiry Details
          </Typography>
          <TableContainer>
            <Table aria-label="enquiry details">
              <TableBody>
                {selectedEnquiry ? (
                  <>
                    <TableRow>
                      <TableCell>Enquiry Code:</TableCell>
                      <TableCell>{selectedEnquiry.enquiryCode}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Parent/Guardian Name:</TableCell>
                      <TableCell>
                        {selectedEnquiry.parent_GaurdianName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Enquiry Follow Up Date:</TableCell>
                      <TableCell>
                        {selectedEnquiry.enquiryFollowUpDate}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Remarks:</TableCell>
                      <TableCell>{selectedEnquiry.remarks}</TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>No data found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </Container>
  );
}

export default EnquiryFollow;
