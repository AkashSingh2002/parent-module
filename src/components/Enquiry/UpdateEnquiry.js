import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Select,
  Button
} from "@mui/material";
import { useParams } from "react-router-dom";

function UpdateEnquiry() {
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const [selectedMode, setSelectedMode] = useState("");
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
    parentAndGurdianName: "",
    reference: "",
    emailId: "",
    remark: "",
    createdBy: 0, // Replace with actual user ID if available
    teacherId: "",
    studentName: "",
    motherName: "",
    amount: 0,
    alternateMobile: ""
  });

  const { enquiryId } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoadingBarProgress(30);
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/Enquiry/EnquirySchoolId?id=${enquiryId}`, {
       
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("token")
        },
        body: JSON.stringify(enquiryData)
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form after successful submission
      setEnquiryData({
        enquiryCode: "",
        enquiryDate: "",
        followupDate: "",
        purposeId: "",
        modeId: "",
        classId: "",
        contactNo: "",
        parentAndGurdianName: "",
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
      setLoadingBarProgress(100);
      alert("Enquiry updated successfully!");
    } catch (error) {
      console.error("Error updating enquiry:", error);
      alert("Failed to submit enquiry. Please try again later.");
    }
  };

  const handleReset = () =>{
    setEnquiryData({
      enquiryCode: "",
      enquiryDate: "",
      followupDate: "",
      purposeId: "",
      modeId: "",
      classId: "",
      contactNo: "",
      parentAndGurdianName: "",
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
  }

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


  useEffect(() => {
    const fetchEnquiryData = async () => {
      try {
        const url = process.env.REACT_APP_BASE_URL;
        const response = await fetch(`${url}/Enquiry/EnquiryId?EnqId=${enquiryId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token")
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch enquiry data for ID ${enquiryId}`);
        }

        const data = await response.json();
        if (data.length > 0) {
          const enquiry = data[0]; // Assuming only one enquiry is returned
          setEnquiryData(enquiry);
        } else {
          throw new Error(`Enquiry with ID ${enquiryId} not found`);
        }
      } catch (error) {
        console.error("Error fetching enquiry data:", error);
      }
    };

    fetchEnquiryData();
  }, [enquiryId]);

  return (
    <div>
      <Container sx={{ marginTop: 6 }}>
        <Typography variant="h3">Enquiry</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={3}>
            <Grid item md={5}>
              <label htmlFor="enquiryCode">Enquiry No.</label>
              <TextField
                id="enquiryCode"
                type="text"
                fullWidth
                value={enquiryData.enquiryCode}
               // onChange={(e) => setEnquiryData({ ...enquiryData, enquiryCode: e.target.value })}
              />
            </Grid>
            <Grid item md={5}>
              <label htmlFor="enquiryDate">Enquiry Date</label>
              <TextField
                id="enquiryDate"
                type="text"
                fullWidth
                value={enquiryData.enquiryDate}
                onChange={(e) => setEnquiryData({ ...enquiryData, enquiryDate: e.target.value })}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item md={5}>
              <label htmlFor="followupDate">Next Followup Date</label>
              <TextField
                id="followupDate"
                type="text"
                fullWidth
                value={enquiryData.followupDate}
                onChange={(e) => setEnquiryData({ ...enquiryData, followupDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={5} marginTop={-1}>
              <label htmlFor="purpose" className="form-label">
                Purpose
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
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={5}>
              <label htmlFor="mode" className="form-label">
                Mode
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
            </Grid>
            <Grid item xs={5}>
              <label htmlFor="class" className="form-label">
                For Class
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
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item md={5}>
              <label htmlFor="contactNo">Contact No.</label>
              <TextField
                id="contactNo"
                type="text"
                fullWidth
                value={enquiryData.contactNo}
                onChange={(e) => setEnquiryData({ ...enquiryData, contactNo: e.target.value })}
              />
            </Grid>
            <Grid item md={5}>
              <label htmlFor="parentAndGurdianName">Father Name</label>
              <TextField
                id="parentAndGurdianName"
                type="text"
                fullWidth
                value={enquiryData.parentAndGurdianName}
                onChange={(e) => setEnquiryData({ ...enquiryData, parentAndGurdianName: e.target.value })}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item md={5}>
              <label htmlFor="studentName">Student Name</label>
              <TextField
                id="studentName"
                type="text"
                fullWidth
                value={enquiryData.studentName}
                onChange={(e) => setEnquiryData({ ...enquiryData, studentName: e.target.value })}
              />
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
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={5} marginTop={-1}>
              <label htmlFor="teacherId" className="form-label">
                Assigned To
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
              Update
            </Button>
            <Button type="button" variant="contained" color="warning" sx={{ marginTop: 2, marginLeft: 2 }} onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </form>
      </Container>
    </div>
  );
}  

export default UpdateEnquiry;