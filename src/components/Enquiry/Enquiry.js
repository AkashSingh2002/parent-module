import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Select,
  Button,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Enquiry() {
  const [loadingBarProgress, setLoadingBarProgress] = useState('');
  const [purposes, setPurposes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modes, setModes] = useState([]);
  const [enquiryData, setEnquiryData] = useState({
    enquiryCode: "",
    enquiryDate: "",
    followupDate: "",
    purposeId: "",
    modeId: "",
    classId: "",
    contactNo: "",
    parentAndGuardianName: "",
    refrence: "",
    emailId: "",
    remark: "",
    createdBy: 0, // Replace with actual user ID if available
    teacherId: "",
    studentName: "",
    motherName: "",
    amount: 0,
    alternateMobile: ""
  });
  const [mandatoryFieldsError, setMandatoryFieldsError] = useState(false);
  const [contactCheckMessage, setContactCheckMessage] = useState('');
  const [contactCheckMessageColor, setContactCheckMessageColor] = useState('');
  const [enquiryExists, setEnquiryExists] = useState(false); // For enquiry check
  const [enquiryMessage, setEnquiryMessage] = useState(""); // Message to show
  const [modalOpen, setModalOpen] = useState(false); // For modal state

  // Function to handle modal open and close
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const navigate = useNavigate();

  // API call to check enquiry by mobile number
  const checkEnquiryByMobile = async (contactNo) => {
    const apiUrl = "https://arizshad-002-site5.ktempurl.com/api/Enquiry/GetEnquiryByMobile";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("token")
        },
        body: JSON.stringify({ contactNo }),
      });

      const responseData = await response.json();

      // If no enquiry is found, show the green message
      if (responseData.msg === "No enquiry found for the given mobile number. You can create a new enquiry.") {
        setEnquiryMessage("No enquiry found for the given mobile number. You can create a new enquiry.");
        setEnquiryExists(false);
      } else {
        // If enquiry exists, show red message with button
        setEnquiryMessage("Enquiry already exists for this given number. ");
        setEnquiryExists(true);
      }
    } catch (error) {
      console.error("Error fetching enquiry:", error);
      setEnquiryMessage("Failed to check enquiry. Please try again.");
      setEnquiryExists(false);
    }
  };

  // Handle contact number input change
  const handleContactChange = (e) => {
    const contactNo = e.target.value;
    setEnquiryData({ ...enquiryData, contactNo });

    if (contactNo.length >= 10) {
      checkEnquiryByMobile(contactNo);
    }
  };

  // Fetch the existing enquiry details if it exists
  const fetchEnquiryDetails = async (contactNo) => {
    const apiUrl = "https://arizshad-002-site5.ktempurl.com/api/Enquiry/GetEnquiryByMobile";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("token")
        },
        body: JSON.stringify({ contactNo }),
      });

      const enquiryDetails = await response.json();

      if (enquiryDetails.length > 0) {
        setEnquiryData(enquiryDetails[0]); // Populate the form with fetched enquiry details
        handleModalOpen(); // Open the modal to display the details
      }
    } catch (error) {
      console.error("Error fetching enquiry details:", error);
    }
  };



  const formatDate = (dateString) => {
    const dateParts = dateString.split("-");
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    return formattedDate;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if mandatory fields are filled
    const mandatoryFields = ['enquiryDate', 'followupDate', 'purposeId', 'modeId', 'classId', 'contactNo', 'teacherId',];
    const isMandatoryFieldsFilled = mandatoryFields.every(field => !!enquiryData[field]);

    if (!isMandatoryFieldsFilled) {
      setMandatoryFieldsError(true);
      return;
    }

    try {
      setLoadingBarProgress(30);

      const formattedEnquiryDate = formatDate(enquiryData.enquiryDate);
      // Formatting followupDate to dd/mm/yyyy format
      const formattedFollowupDate = formatDate(enquiryData.followupDate);

      const payload = {
        ...enquiryData,
        enquiryDate: formattedEnquiryDate,
        followupDate: formattedFollowupDate
      };
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/Enquiry/InsertEnquirySchool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("token")
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.msg === "Details already exist!") {
        alert("Enquiry details already exist!");
      } else {
        // Reset form after successful submission
        setEnquiryData({
          enquiryCode: "",
          enquiryDate: "",
          followupDate: "",
          purposeId: "",
          modeId: "",
          classId: "",
          contactNo: "",
          parentAndGuardianName: "",
          refrence: "",
          emailId: "",
          remark: "",
          createdBy: 0,
          teacherId: "",
          studentName: "",
          motherName: "",
          amount: 0,
          alternateMobile: ""
        });
        setLoadingBarProgress(100);
        alert("Enquiry submitted successfully!");
      }
    } catch (error) {
      setLoadingBarProgress(0);
      console.error("Error submitting enquiry:", error);

      alert("Failed to submit enquiry. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": token,
        };

        const responses = await Promise.all([
          fetch(`${apiUrl}/Enquiry/ddlMode`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({})
          }),
          fetch(`${apiUrl}/Enquiry/ddlPurpose`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({})
          }),
          fetch(`${apiUrl}/Enquiry/ddlClassName`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({})
          }),
          fetch(`${apiUrl}/Enquiry/ddlTeacher`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({})
          })
        ]);

        const [modeResponse, purposeResponse, classResponse, subResponse] = responses;

        if (!modeResponse.ok || !purposeResponse.ok || !classResponse.ok || !subResponse.ok) {
          alert("Failed to fetch dropdown data");
          return;
        }

        const modeData = await modeResponse.json();
        const purposeData = await purposeResponse.json();
        const classData = await classResponse.json();
        const subData = await subResponse.json();

        if (modeData.data === null && modeData.msg === "Record Not Found") {
          console.error('Record Not Found for Mode');
          alert('Record Not Found for Mode');
          return;
        }

        if (purposeData.data === null && purposeData.msg === "Record Not Found") {

          return;
        }

        if (classData.data === null && classData.msg === "Record Not Found") {
          console.error('Record Not Found for Class');

          return;
        }

        if (subData.data === null && subData.msg === "Record Not Found") {
          console.error('Record Not Found for Teacher');

          return;
        }

        setModes(modeData);
        setPurposes(purposeData);
        setClasses(classData);
        setSubjects(subData);

      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        alert("An error occurred. Please try again later.");
      }
    };

    fetchDropdownData();
  }, []);

  const handleReset = () => {
    setEnquiryData({
      enquiryCode: "New",
      enquiryDate: "",
      followupDate: "",
      purposeId: "",
      modeId: "",
      classId: "",
      contactNo: "",
      parentAndGuardianName: "",
      reference: "",
      emailId: "",
      remark: "",
      createdBy: 0,
      teacherId: "",
      studentName: "",
      motherName: "",
      amount: 0,
      alternateMobile: ""
    });
    setMandatoryFieldsError(false);
  };

  const handlePurposeChange = (event) => {
    setEnquiryData({ ...enquiryData, purposeId: event.target.value });
  };
  const handleClassChange = (event) => {
    setEnquiryData({ ...enquiryData, classId: event.target.value });
  };
  const handleSubChange = (event) => {
    setEnquiryData({ ...enquiryData, teacherId: event.target.value });
  };
  const handleModeChange = (event) => {
    setEnquiryData({ ...enquiryData, modeId: event.target.value });
  };

  return (
    <div>
      <Container sx={{ marginTop: 6 }}>
        <Typography variant="h3">Enquiry</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={2}>
            <Grid item md={5}>
              <label htmlFor="enquiryCode">Enquiry No.<span style={{ color: 'red' }}>*</span></label>
              <TextField
                id="enquiryCode"
                type="text"
                fullWidth
                placeholder="New"
                value={enquiryData.enquiryCode}
              //onChange={(e) => setEnquiryData({ ...enquiryData, enquiryCode: e.target.value })}
              />
            </Grid>
            <Grid item md={5}>
              <label htmlFor="enquiryDate">Enquiry Date<span style={{ color: 'red' }}>*</span></label>
              <TextField
                id="enquiryDate"
                type="date"
                fullWidth
                value={enquiryData.enquiryDate}
                onChange={(e) => setEnquiryData({ ...enquiryData, enquiryDate: e.target.value })}
              />
              {mandatoryFieldsError && !enquiryData.enquiryDate && <FormHelperText error>Please select enquiry date</FormHelperText>}
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item md={5}>
              <label htmlFor="followupDate">Next Followup Date<span style={{ color: 'red' }}>*</span></label>
              <TextField
                id="followupDate"
                type="date"
                fullWidth
                value={enquiryData.followupDate}
                onChange={(e) => setEnquiryData({ ...enquiryData, followupDate: e.target.value })}
              />
              {mandatoryFieldsError && !enquiryData.followupDate && <FormHelperText error>Please select next followup date</FormHelperText>}
            </Grid>
            <Grid item xs={5} marginTop={-1}>
              <label htmlFor="purpose" className="form-label">
                Purpose<span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id="purpose"
                value={enquiryData.purposeId}
                onChange={handlePurposeChange}
                fullWidth
              >
                <MenuItem value="">--Select--</MenuItem>
                {purposes.map((purpose) => (
                  <MenuItem key={purpose.purposeId} value={purpose.purposeId}>
                    {purpose.purpose}
                  </MenuItem>
                ))}
              </Select>
              {mandatoryFieldsError && !enquiryData.purposeId && <FormHelperText error>Please select purpose</FormHelperText>}
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={5}>
              <label htmlFor="mode" className="form-label">
                Mode<span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id="mode"
                value={enquiryData.modeId}
                onChange={handleModeChange}
                fullWidth
              >
                <MenuItem value="">--Select--</MenuItem>
                {modes.map((mode) => (
                  <MenuItem key={mode.modeId} value={mode.modeId}>
                    {mode.modeName}
                  </MenuItem>
                ))}
              </Select>
              {mandatoryFieldsError && !enquiryData.modeId && <FormHelperText error>Please select mode</FormHelperText>}
            </Grid>
            <Grid item xs={5}>
              <label htmlFor="class" className="form-label">
                For Class<span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id="class"
                value={enquiryData.classId}
                onChange={handleClassChange}
                fullWidth
              >
                <MenuItem value="">--Select--</MenuItem>
                {classes.map((classItem) => (
                  <MenuItem key={classItem.classId} value={classItem.classId}>
                    {classItem.className}
                  </MenuItem>
                ))}
              </Select>
              {mandatoryFieldsError && !enquiryData.classId && <FormHelperText error>Please select class</FormHelperText>}
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item md={5}>
              <label htmlFor="contactNo">Contact No.<span style={{ color: 'red' }}>*</span></label>
              <TextField
                id="contactNo"
                type="text"
                fullWidth
                value={enquiryData.contactNo}
                onChange={handleContactChange}
              />
              {enquiryMessage && (
                <FormHelperText
                  style={{
                    color: enquiryExists ? "red" : "green",
                  }}
                >
                  {enquiryMessage}{" "}
                  {enquiryExists && (
                    <Button color="secondary" onClick={() => fetchEnquiryDetails(enquiryData.contactNo)}>
                      View Details
                    </Button>
                  )}
                </FormHelperText>
              )}
            </Grid>
            <Grid item md={5}>
              <label htmlFor="parentAndGurdianName">Father Name<span style={{ color: 'red' }}>*</span></label>
              <TextField
                id="parentAndGurdianName"
                type="text"
                fullWidth
                value={enquiryData.parentAndGurdianName}
                onChange={(e) => setEnquiryData({ ...enquiryData, parentAndGurdianName: e.target.value })}
              />
              {mandatoryFieldsError && !enquiryData.parentAndGurdianName && <FormHelperText error>Please enter father name</FormHelperText>}
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item md={5}>
              <label htmlFor="studentName">Student Name<span style={{ color: 'red' }}>*</span></label>
              <TextField
                id="studentName"
                type="text"
                fullWidth
                value={enquiryData.studentName}
                onChange={(e) => setEnquiryData({ ...enquiryData, studentName: e.target.value })}
              />
              {mandatoryFieldsError && !enquiryData.studentName && <FormHelperText error>Please enter student name</FormHelperText>}
            </Grid>
            <Grid item md={5}>
              <label htmlFor="motherName">Mother Name</label>
              <TextField
                id="motherName"
                type="text"
                fullWidth
                value={enquiryData.motherName}
                onChange={(e) => setEnquiryData({ ...enquiryData, motherName: e.target.value })}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item md={5}>
              <label htmlFor="alternateMobile">Alternate number</label>
              <TextField
                id="alternateMobile"
                type="text"
                fullWidth
                value={enquiryData.alternateMobile}
                onChange={(e) => setEnquiryData({ ...enquiryData, alternateMobile: e.target.value })}
              />
            </Grid>
            <Grid item md={5}>
              <label htmlFor="emailId">Email-Id</label>
              <TextField
                id="emailId"
                type="text"
                fullWidth
                value={enquiryData.emailId}
                onChange={(e) => setEnquiryData({ ...enquiryData, emailId: e.target.value })}

              />
              {/* {mandatoryFieldsError && !enquiryData.emailId && <FormHelperText error>Please enter valid email</FormHelperText>} */}
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={5} marginTop={-1}>
              <label htmlFor="teacherId" className="form-label">
                Assigned To<span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id="teacherId"
                value={enquiryData.teacherId}
                onChange={handleSubChange}
                fullWidth
              >
                <MenuItem value="">--Select--</MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject.userId} value={subject.userId}>
                    {subject.employeeName}
                  </MenuItem>
                ))}
              </Select>
              {mandatoryFieldsError && !enquiryData.teacherId && <FormHelperText error>Please select teacher</FormHelperText>}
            </Grid>
            <Grid item md={5}>
              <label htmlFor="reference">Reference</label>
              <TextField
                id="reference"
                type="text"
                fullWidth
                value={enquiryData.reference}
                onChange={(e) => setEnquiryData({ ...enquiryData, reference: e.target.value })}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={5}>
              <label htmlFor="remark">Remark</label>
              <TextField
                id="remark"
                type="text"
                fullWidth
                value={enquiryData.remark}
                onChange={(e) => setEnquiryData({ ...enquiryData, remark: e.target.value })}
              />
            </Grid>
            {/* Additional fields can be added here */}
          </Grid>
          <Grid item xs={6}>
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Save
            </Button>
            <Button type="button" variant="contained" color="warning" sx={{ marginTop: 2, marginLeft: 2 }} onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </form>
      </Container>

        {/* Modal to show the existing enquiry data */}
      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="md" fullWidth>
        <DialogTitle>Enquiry Details</DialogTitle>
        <DialogContent>
          {/* All fields inside the modal, with pre-filled values */}
          <Grid container spacing={2} mt={2}>
            <Grid item md={6}>
              <label htmlFor="enquiryCode">Enquiry No.</label>
              <TextField
                id="enquiryCode"
                type="text"
                fullWidth

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="enquiryDate">Enquiry Date</label>
              <TextField
                id="enquiryDate"
                type="text"
                fullWidth
                value={enquiryData.enquiryDate}
               
              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="followupDate">Next Followup Date</label>
              <TextField
                id="followupDate"
                type="text"
                fullWidth
                value={enquiryData.followupDate}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="parentAndGuardianName">Father Name</label>
              <TextField
                id="parentAndGuardianName"
                type="text"
                fullWidth
                value={enquiryData.parentAndGuardianName}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="studentName">Student Name</label>
              <TextField
                id="studentName"
                type="text"
                fullWidth
                value={enquiryData.studentName}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="motherName">Mother Name</label>
              <TextField
                id="motherName"
                type="text"
                fullWidth
                value={enquiryData.motherName}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="emailId">Email ID</label>
              <TextField
                id="emailId"
                type="email"
                fullWidth
                value={enquiryData.emailId}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="alternateMobile">Alternate Mobile</label>
              <TextField
                id="alternateMobile"
                type="text"
                fullWidth
                value={enquiryData.alternateMobile}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="refrence">Reference</label>
              <TextField
                id="refrence"
                type="text"
                fullWidth
                value={enquiryData.refrence}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="remark">Remark</label>
              <TextField
                id="remark"
                type="text"
                fullWidth
                value={enquiryData.remark}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="amount">Amount</label>
              <TextField
                id="amount"
                type="number"
                fullWidth
                value={enquiryData.amount}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="classId">Class</label>
              <TextField
                id="classId"
                type="text"
                fullWidth
                value={enquiryData.classId}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="modeId">Mode</label>
              <TextField
                id="modeId"
                type="text"
                fullWidth
                value={enquiryData.modeId}

              />
            </Grid>
            <Grid item md={6}>
              <label htmlFor="purposeId">Purpose</label>
              <TextField
                id="purposeId"
                type="text"
                fullWidth
                value={enquiryData.purposeId}

              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate(`/editenquiry/${enquiryData.enquiryId}`)} color="primary" variant="contained">
            Update
          </Button>
          <Button onClick={handleModalClose} color="secondary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Enquiry;
