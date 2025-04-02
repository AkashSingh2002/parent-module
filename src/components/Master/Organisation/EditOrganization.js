import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { Container, Typography, Grid, TextField, Button } from "@mui/material";

const EditOrganization = () => {
  let navigate = useNavigate();
  const { organisationId } = useParams();
  const location = useLocation(); // Access navigation state
  const [formData, setFormData] = useState({
    organisationName: "",
    email: "",
    mobileNo: "",
    landlineNo: "",
    address: "",
    zipCode: "",
    fax: "",
    website: "",
  });
  const [loadingBarProgress, setLoadingBarProgress] = useState("");

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const response = await fetch(`${apiUrl}/Organization/GetOrganization`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          const organization = data.find(
            (org) => org.schoolId === parseInt(organisationId)
          );
          if (organization) {
            setFormData({
              organisationName: organization.schoolName,
              email: organization.email,
              mobileNo: organization.mobileNo,
              landlineNo: organization.phoneNo,
              address: organization.address,
              zipCode: "",
              fax: "",
              website: "",
            });
          }
        } else {
          console.error("Failed to fetch organization details");
        }
      } catch (error) {
        console.error("API request error:", error);
      }
    };

    fetchOrganizationDetails();
  }, [organisationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(
        `${apiUrl}/Organization/OrgId?OrganizationId=${organisationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            OrganisationName: formData.organisationName,
            email: formData.email,
            MobileNo: formData.mobileNo,
            LandlineNo: formData.landlineNo,
            address: formData.address,
            zipCode: formData.zipCode,
            fax: formData.fax,
            website: formData.website,
          }),
        }
      );

      if (response.ok) {
        setLoadingBarProgress(100);
        alert("Details Updated Successfully");
        setFormData({
          organisationName: "",
          email: "",
          mobileNo: "",
          landlineNo: "",
          address: "",
          zipCode: "",
          fax: "",
          website: "",
        });
        // Navigate back to Organization.js with encodedFormId
        const encodedFormId = location.state?.encodedFormId;
        if (encodedFormId) {
          navigate(`/organization/${encodedFormId}`);
        } else {
          navigate("/organization/MTM="); // Fallback to default if not provided
        }
      } else {
        setLoadingBarProgress(0);
        alert("Error Updating Details");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  const handleCancel = () => {
    const encodedFormId = location.state?.encodedFormId;
    if (encodedFormId) {
      navigate(`/organization/${encodedFormId}`);
    } else {
      navigate("/organization/MTM="); // Fallback to default if not provided
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Edit Organization
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Organization Name"
              variant="outlined"
              name="organisationName"
              value={formData.organisationName}
              placeholder="Enter organization name"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              variant="outlined"
              name="email"
              value={formData.email}
              placeholder="Enter email"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="tel"
              label="Mobile No."
              variant="outlined"
              name="mobileNo"
              value={formData.mobileNo}
              placeholder="Enter mobile number"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="tel"
              label="Landline No."
              variant="outlined"
              name="landlineNo"
              value={formData.landlineNo}
              placeholder="Enter landline number"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Address"
              variant="outlined"
              name="address"
              value={formData.address}
              placeholder="Enter address"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="text"
              label="Zip Code"
              variant="outlined"
              name="zipCode"
              value={formData.zipCode}
              placeholder="Enter zip code"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="text"
              label="Fax"
              variant="outlined"
              name="fax"
              value={formData.fax}
              placeholder="Enter fax number"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="text"
              label="Website"
              variant="outlined"
              name="website"
              value={formData.website}
              placeholder="Enter website URL"
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <div style={{ marginTop: "16px" }}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="small"
            onClick={handleUpdate}
          >
            Update
          </Button>
          <Button
            type="button"
            variant="contained"
            color="error"
            size="small"
            onClick={handleCancel}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default EditOrganization;
