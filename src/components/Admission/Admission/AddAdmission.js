import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import LoadingBar from "react-top-loading-bar";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  Paper,
} from "@mui/material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  AppBar,
  Toolbar,
  Typography,
  Container,
  FormControlLabel,
  Checkbox,
  Input,
  Grid,
  TextField,
  TableCell,
  TableBody,
  TableRow,
  Table,
  TableHead,
  FormHelperText,
} from "@mui/material";

const AddAdmission = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [parentsDobChecked, setParentsDobChecked] = useState(false);
  const [regisData, setRegisData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nationality, setNationality] = useState([]);
  const [religion, setReligion] = useState([]);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [ddlClass, setddlClass] = useState([]);
  const [ddlSection, setddlSection] = useState([]);
  const [rollNo, setRollNo] = useState("");
  const [occupation, setOccupation] = useState([]);
  const [gender, setGender] = useState([]);
  const [bloodgrp, setBloodgrp] = useState([]);
  const [concessionData, setConcessionData] = useState([]);
  const [month, setMonth] = useState([]);
  const [isTransport, setIsTransport] = useState(false);
  const [isHostel, setIsHostel] = useState(false);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [caste, setCaste] = useState([]);
  const [duplicateRollNoMessage, setDuplicateRollNoMessage] = useState("");
  const [streams, setStreams] = useState([]);
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [copyStudentMobile, setCopyStudentMobile] = useState(false);
  const [copyStudentAddressForFather, setCopyStudentAddressForFather] = useState(false);
  const [copyStudentAddressForMother, setCopyStudentAddressForMother] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    admissionDate: "",
    financialYearID: "",
    registrationNo: "",
    dated: "",
    name: "",
    lname: "",
    classId: "",
    sectionId: "",
    newRollNo: "",
    dob: "",
    age: "",
    email: "",
    adharNO: "",
    CertiNo: "",
    mobileNo: "",
    address: "",
    nationalityId: "",
    religionID: "",
    countryId: "",
    stateId: "",
    cityId: "",
    genderId: "",
    casteId: "",
    bloodGroupId: "",
    lastSchoolAttended: "",
    paymentType: "0",
    fatherName: "",
    fdob: "",
    mdob: "",
    ews: "",
    isTransport: "",
    isHostel: "",
    annualAmount: "",
    MotherName: "",
    fatherMobile: "",
    MotherMobile: "",
    Femail: "",
    Memail: "",
    grandFather: "",
    FIncome: "",
    MIncome: "",
    FAadhar: "",
    MAadhar: "",
    Faddress: "",
    Maddress: "",
    parentsDobChecked: false,
    MotheroccupationID: "",
    FatheroccupationID: "",
    studentprofile: null,
    motherprofile: null,
    fatherprofile: null,
    aadharCardFront: null,
    aadharCardBack: null,
    birthCertificate: null,
    transferCertificate: null,
    others: null,
  });

  const resetForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setRegistrationData({
      admissionDate: today,
      financialYearID: "",
      registrationNo: "",
      registrationId: 0,
      dated: "",
      name: "",
      lname: "",
      classId: "",
      sectionId: "",
      newRollNo: "",
      dob: "",
      age: "",
      email: "",
      adharNO: "",
      CertiNo: "",
      mobileNo: "",
      address: "",
      nationalityId: "",
      religionID: "",
      countryId: "",
      stateId: "",
      cityId: "",
      genderId: "",
      casteId: "",
      bloodGroupId: "",
      lastSchoolAttended: "",
      paymentType: "0", // Reset to default "0"
      fatherName: "",
      fdob: "",
      mdob: "",
      ews: "",
      isTransport: "",
      isHostel: "",
      annualAmount: "",
      MotherName: "",
      fatherMobile: "",
      MotherMobile: "",
      Femail: "",
      Memail: "",
      grandFather: "",
      FIncome: "",
      MIncome: "",
      FAadhar: "",
      MAadhar: "",
      Faddress: "",
      Maddress: "",
      parentsDobChecked: false,
      MotheroccupationID: "",
      FatheroccupationID: "",
      studentprofile: null,
      motherprofile: null,
      fatherprofile: null,
      aadharCardFront: null,
      aadharCardBack: null,
      birthCertificate: null,
      transferCertificate: null,
      others: null,
    });
    setParentsDobChecked(false);
    setRollNo("");
    setSelectedStream("");
    setSelectedItems([]);
    setIsTransport(false);
    setIsHostel(false);
    setCopyStudentMobile(false);
    setCopyStudentAddressForFather(false);
    setCopyStudentAddressForMother(false);
    setErrors({
      financialYearID: false,
      name: false,
      classId: false,
      sectionId: false,
      mobileNo: false,
      religionID: false,
      nationalityId: false,
      dob: false,
      age: false,
      fatherName: false,
      MotherName: false,
      FatheroccupationID: false,
      casteId: false,
      fatherMobile: false,
    });
  };

  const [errors, setErrors] = useState({
    financialYearID: false,
    name: false,
    classId: false,
    sectionId: false,
    mobileNo: false,
    religionID: false,
    nationalityId: false,
    dob: false,
    age: false,
    fatherName: false,
    MotherName: false,
    FatheroccupationID: false,
    casteId: false,
    fatherMobile: false,
  });

  // Handler for copying student's mobile number to father's mobile number
  const handleCopyStudentMobileChange = (e) => {
    const isChecked = e.target.checked;
    setCopyStudentMobile(isChecked);
    if (isChecked) {
      setRegistrationData({
        ...registrationData,
        fatherMobile: registrationData.mobileNo,
      });
    } else {
      setRegistrationData({
        ...registrationData,
        fatherMobile: "",
      });
    }
  };

  // Handler for copying student's address to father's address
  const handleCopyStudentAddressForFatherChange = (e) => {
    const isChecked = e.target.checked;
    setCopyStudentAddressForFather(isChecked);
    if (isChecked) {
      setRegistrationData({
        ...registrationData,
        Faddress: registrationData.address,
      });
    } else {
      setRegistrationData({
        ...registrationData,
        Faddress: "",
      });
    }
  };

  // Handler for copying student's address to mother's address
  const handleCopyStudentAddressForMotherChange = (e) => {
    const isChecked = e.target.checked;
    setCopyStudentAddressForMother(isChecked);
    if (isChecked) {
      setRegistrationData({
        ...registrationData,
        Maddress: registrationData.address,
      });
    } else {
      setRegistrationData({
        ...registrationData,
        Maddress: "",
      });
    }
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
    setRegistrationData((prevData) => ({
      ...prevData,
      admissionDate: currentDate,
    }));
  }, []);

  const [selectedConcession, setSelectedConcession] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // Control dialog visibility

  const handleAddItem = () => {
    if (
      selectedConcession &&
      selectedMonth &&
      selectedAmount &&
      !isNaN(selectedAmount)
    ) {
      const selectedConcessionObject = concessionData.find(
        (item) => item.concessionName === selectedConcession
      );

      if (selectedConcessionObject) {
        let itemsToAdd = [];

        // Check if "Select All Months" is selected
        if (selectedMonth === "All") {
          // Add all months to the selected items
          itemsToAdd = month.map((item) => ({
            concessionId: selectedConcessionObject.concessionId,
            concession: selectedConcession,
            month: item.month,
            amount: parseFloat(selectedAmount),
          }));
        } else {
          // Add the selected month to the selected items
          itemsToAdd.push({
            concessionId: selectedConcessionObject.concessionId,
            concession: selectedConcession,
            month: selectedMonth,
            amount: parseFloat(selectedAmount),
          });
        }

        setSelectedItems((prevItems) => [...prevItems, ...itemsToAdd]);

        // Clear selected values after adding item
        setSelectedConcession("");
        setSelectedMonth("");
        setSelectedAmount("");
      }
    }
  };

  const handleDeleteItem = (index) => {
    setSelectedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleTransportChange = (e) => {
    setIsTransport(e.target.checked);
  };

  const handleHostelChange = (e) => {
    setIsHostel(e.target.checked);
  };

  const handleFileChange = (fieldName, event) => {
    const file = event.target.files[0]; // Get the selected file
    const fileSizeKB = file.size / 1024; // Convert file size to KB
    if (fileSizeKB > 200) {
      // If file size exceeds 200KB, show an alert
      alert("File size exceeds the limit of 200KB.");
      event.target.value = null; // Clear the file input
      return;
    }
    // Proceed with updating registration data
    setRegistrationData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  // const handleClassChange = (e) => {
  //     const selectedClassId = e.target.value;
  //     setRegistrationData((prevData) => ({
  //         ...prevData,
  //         classId: selectedClassId,
  //     }));
  // };

  // const handleSectionChange = (e) => {
  //     const selectedSectionId = e.target.value;
  //     setRegistrationData((prevData) => ({
  //         ...prevData,
  //         sectionId: selectedSectionId,
  //     }));
  // }

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; // Returns YYYY-MM-DD
  };

  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    const selectedClassName = ddlClass.find(
      (classItem) => classItem.classId === selectedClassId
    )?.className;
    setRegistrationData((prevData) => ({
      ...prevData,
      classId: selectedClassId,
      className: selectedClassName || "",
    }));
    fetchddlSection();
  };

  const handleSectionChange = (e) => {
    const selectedSectionId = e.target.value;
    const selectedSectionName = ddlSection.find(
      (sectionItem) => sectionItem.sectionId === selectedSectionId
    )?.sectionName;
    setRegistrationData((prevData) => ({
      ...prevData,
      sectionId: selectedSectionId,
      sectionName: selectedSectionName || "",
    }));
  };

  const handleRowSelection = async (selectedRegistration, registrationId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/Admission/GetStudentDetails_Regid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            regId: registrationId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching student details: ${response.status}`);
      }

      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return;
      }

      const studentData = data[0];

      // Find the nationalityId based on the nationality name
      const selectedNationality = nationality.find(
        (n) => n.nationality === studentData.nationality
      );
      const nationalityId = selectedNationality
        ? selectedNationality.nationalityId
        : "";

      setRegistrationData((prevData) => ({
        ...prevData,
        registrationNo: studentData.registrationNo || "",
        registrationId: studentData.registrationId, // Add registrationId
        dated: studentData.dated || "",
        name: studentData.studentFirstName || "",
        fatherName: studentData.fatherName || "",
        dob: formatDateForInput(studentData.studentDOB) || "",
        age: studentData.studentAge.toString() || "",
        genderId: studentData.genderId || "",
        nationalityId: nationalityId || "", // Use the ID, not the name
        mobileNo: studentData.studentMobile || "",
        email: studentData.emailId || "",
        address: studentData.address || "",
        adharNO: studentData.studentAdhaarNo || "",
        classId: studentData.classId || "",
        countryId: studentData.countryId || "",
        stateId: studentData.stateId || "",
        cityId: studentData.cityID || "",
        grandFather: studentData.grandFather || "",
      }));

      handleClose();
    } catch (error) {
      console.error("Error in handleRowSelection:", error);
      handleClose();
    }
  };

  const fetchFinancialYears = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/ClassPromotion/GetFinancialYear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }

      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return; // Exit the function if the record is not found
      }
      setFinancialYears(data);

      // Calculate the current financial year based on the system date
      const today = new Date();
      const currentYear = today.getFullYear();
      const nextYear = currentYear + 1;

      // Determine the financial year
      const financialYearStart = new Date(currentYear, 3, 1); // April 1st of the current year
      const financialYearEnd = new Date(nextYear, 2, 31); // March 31st of the next year

      let currentSessionString;
      if (today >= financialYearStart && today <= financialYearEnd) {
        // Current date falls in the financial year (e.g., April 1, 2024 - March 31, 2025)
        currentSessionString = `${currentYear}-${nextYear}`;
      } else {
        // Current date falls in the previous financial year (e.g., January 1, 2024 - March 31, 2024)
        currentSessionString = `${currentYear - 1}-${currentYear}`;
      }

      // Find the session that matches the current financial year
      const currentSession = data.find(
        (item) => item.finanacialYear === currentSessionString
      );

      if (currentSession) {
        setRegistrationData((prevData) => ({
          ...prevData, // Preserve the existing fields in registrationData
          financialYearID: currentSession.financialYearID, // Set the financialYearID
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };

  const fetchRegistration = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Admission/FetchReg_Admission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        alert("Record Not Found");
        return; // Exit the function if the record is not found
      }
      setRegisData(data);
      handleShow(); // Open the modal after fetching data
      //setSelectedValue(data[0]); // Assuming the API returns an array of options
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNationalityData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Nationality/GetNationality`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching nationality data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Nationality Data:", data); // Add this to inspect the response
      setNationality(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchReligionData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Religion/GetReligion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const religionData = await response.json();

      if (
        religionData.data === null &&
        religionData.msg === "Record Not Found"
      ) {
        return; // Exit the function if the record is not found
      }

      setReligion(religionData);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchCountry = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Registration/ddlCountry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }

      setCountry(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchOcccupation = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Occupation/GetOccupation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return; // Exit the function if the record is not found
      }

      setOccupation(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    // Call fetchState when registrationData.countryId changes
    if (registrationData.countryId) {
      fetchState();
    }
    if (registrationData.stateId) {
      fetchCity();
    }
    if (registrationData.classId) {
      setRollNo([]);
      fetchddlSection();
    }
    if (registrationData.classId && registrationData.sectionId) {
      fetchRollno();
    }
  }, [
    registrationData.countryId,
    registrationData.stateId,
    registrationData.classId,
    registrationData.sectionId,
  ]);

  useEffect(() => {
    // Reset sectionId when classId changes
    setRegistrationData((prevData) => ({
      ...prevData,
      sectionId: "0", // Reset to initial state or set to the default value
    }));
  }, [registrationData.classId]);

  const fetchState = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Registration/ddlState`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          countryId: registrationData.countryId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return; // Exit the function if the record is not found
      }

      setState(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchCity = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Registration/ddlCity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          stateId: registrationData.stateId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return; // Exit the function if the record is not found
      }

      setCity(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchddlClass = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return; // Exit the function if the record is not found
      }

      setddlClass(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchddlSection = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/ClassPromotion/ddlSection_clsId`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            teacherId: 0,
            classId: registrationData.classId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }

      const responseData = await response.json();

      if (
        responseData.data === null &&
        responseData.msg === "Record Not Found"
      ) {
        // Handle the case where no records are found
        console.warn("No records found for sections");
        // You can set a default value or perform any other necessary action
        // For example, setddlSection([]) if an empty array is expected
      } else {
        setddlSection(responseData);
        //setSelectedValue(responseData.data[0]); // Assuming the API returns an array of options
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRollno = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");

      // Convert sectionId to number and ensure it's not empty/undefined
      const sectionId = registrationData.sectionId
        ? parseInt(registrationData.sectionId)
        : 0; // Default to 0 if not selected

      // Convert classId to number as well for consistency
      const classId = registrationData.classId
        ? parseInt(registrationData.classId)
        : 0;

      // Only proceed if both classId and sectionId are valid numbers
      if (!classId || !sectionId) {
        console.warn("Class ID or Section ID is missing");
        return;
      }

      const response = await fetch(`${apiUrl}/Admission/GetNewRollNo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          classId: classId,
          sectionId: sectionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching roll number: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setRollNo(data[0].newRollNo);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkDuplicateRollNo = async (rollNo) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Admission/CheckDuplicateRollNo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          classId: registrationData.classId,
          sectionId: registrationData.sectionId,
          rollNo: Number(rollNo), // Send the rollNo in the payload
          sessionId: registrationData.financialYearID?.[0] || null, // Extract first value from the array, or use null if undefined
        }),
      });

      const data = await response.json();

      // If the response message indicates the roll number is already taken
      if (data.message === "Roll number already exists.") {
        setDuplicateRollNoMessage("Roll number is already taken.");
      } else {
        setDuplicateRollNoMessage(""); // Clear the message if the roll number is not taken
      }
    } catch (error) {
      console.error("Error checking duplicate roll number:", error);
    }
  };

  const fetchGender = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Admission/ddlGender`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching roll number: ${response.status}`);
      }
      const data = await response.json();
      setGender(data); // Assuming the response contains the new roll number
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBloodgrp = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Admission/ddlBloodGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching roll number: ${response.status}`);
      }
      const data = await response.json();
      setBloodgrp(data); // Assuming the response contains the new roll number
    } catch (error) {
      console.error(error);
    }
  };

  const fetchConcession = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Concession/GetConcession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return; // Exit the function if the record is not found
      }

      setConcessionData(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchMonth = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Fine/GetMonthList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return; // Exit the function if the record is not found
      }

      setMonth(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchCaste = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Caste/GetCaste`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching caste data: ${response.status}`);
      }

      const data = await response.json();

      // Handle the case when data is null or record not found
      if (data.data === null && data.msg === "Record Not Found") {
        setCaste([]); // Set caste to an empty array to prevent rendering errors
        console.error("Record Not Found");
        return; // Exit the function if no records are found
      }

      // If data is valid, set the caste state with the response
      setCaste(data.data || []); // Ensure that data is always an array
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    fetchFinancialYears();
    fetchNationalityData();
    fetchReligionData();
    fetchCountry();
    fetchddlClass();
    fetchOcccupation();
    fetchBloodgrp();
    fetchGender();
    fetchConcession();
    fetchMonth();
    fetchCaste();
  }, []);

  const formattedDate = (rawDate) => {
    const selectedDate = new Date(rawDate);
    const day = selectedDate.getDate().toString().padStart(2, "0");
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = selectedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const checkAdmissionNo = async (admissionNo) => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const token = sessionStorage.getItem("token");
    const url = `${apiUrl}/Admission/CheckExistAdmissionNo`;
    const payload = { admissionNo };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.status === "Failed!") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          admissionNo: "Admission number is already taken",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          admissionNo: "",
        }));
      }
    } catch (error) {
      console.error("Error checking admission number:", error);
    }
  };

  const handleAdmissionNoChange = (e) => {
    const { value } = e.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      admissionNo: value,
    }));
    if (value) {
      checkAdmissionNo(value);
    }
  };

  useEffect(() => {
    // Fetch the streams from the API using fetch
    const fetchStreams = async () => {
      try {
        const Url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${Url}/Stream/GetAllStreams`;
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ streamID: 0 }), // Initial payload: streamID = 0
        });
        const data = await response.json();

        // Check if the response contains the 'msg' key indicating no records
        if (data && data.msg === "No records found.") {
          setStreams([]); // Set streams to an empty array if no records found
        } else if (Array.isArray(data)) {
          setStreams(data); // If data is an array, set the streams
        } else {
          setStreams([]); // Handle unexpected response format
        }
      } catch (error) {
        console.error("Error fetching streams:", error);
        setStreams([]); // Handle error by setting streams to an empty array
      }
    };

    fetchStreams();
  }, []);

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    const mandatoryFields = {
      financialYearID: !registrationData.financialYearID,
      name: !registrationData.name,
      age: !registrationData.age,
      dob: !registrationData.dob,
      mobileNo: !registrationData.mobileNo,
      fatherMobile: !registrationData.fatherMobile, // Add this line
    };

    if (Object.values(mandatoryFields).some((field) => field)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...Object.fromEntries(
          Object.entries(mandatoryFields).map(([key, value]) => [
            key,
            value ? "This field is required" : "",
          ])
        ),
      }));
      setDialogMessage("Please fill all mandatory fields.");
      setOpenDialog(true);
      return;
    }

    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/Admission`;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem("token");

      const className =
        ddlClass.find((c) => c.classId === registrationData.classId)
          ?.className || "";
      const sectionName =
        ddlSection.find((s) => s.sectionId === registrationData.sectionId)
          ?.sectionName || "";

      const payload = {
        admissionDate: formattedDate(registrationData.admissionDate),
        studentFirstName: registrationData.name || "",
        studentLastName: registrationData.lname || "",
        registrationId: registrationData.registrationId, // Include registrationId
        studentDOB: formattedDate(registrationData.dob) || "",
        studentAge: parseInt(registrationData.age) || 0,
        rollNo: registrationData.newRollNo || rollNo || "",
        address: registrationData.address || "",
        emailId: registrationData.email || "",
        studentAdhaarNo: registrationData.adharNO || "",
        studentMobile: registrationData.mobileNo || "",
        fetherMobile: registrationData.fatherMobile || "",
        sessionId: registrationData.financialYearID || "",
        classId: registrationData.classId || "",
        className,
        sectionName,
        sectionId: registrationData.sectionId || "",
        genderId: registrationData.genderId || "",
        nationalityId: parseInt(registrationData.nationalityId) || 0, // Ensure it's an integer
        countryId: registrationData.countryId || "",
        stateId: registrationData.stateId || "",
        cityId: registrationData.cityId || "",
        religionId: registrationData.religionID || "",
        casteId: registrationData.casteId || 0,
        bloodGroupId: registrationData.bloodGroupId || "",
        paymentType: parseInt(registrationData.paymentType) || 0,
        parentsDetails: {
          fatherName: registrationData.fatherName || "",
          fatherMobile: registrationData.fatherMobile || "",
          fatherEmail: registrationData.Femail || "",
          motherName: registrationData.MotherName || "",
          motherMobile: registrationData.MotherMobile || "",
          motherEmail: registrationData.Memail || "",
          granfatherName: registrationData.grandFather || "",
        },
      };

      const formData = new FormData();
      for (const key in payload) {
        if (key === "parentsDetails") {
          for (const subKey in payload[key]) {
            formData.append(`parentsDetails.${subKey}`, payload[key][subKey]);
          }
        } else {
          formData.append(key, payload[key]);
        }
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const responseData = await response.json();
      setLoadingBarProgress(100);

      if (response.ok) {
        alert("Data Saved Successfully");
        // Reset form (unchanged)
      } else {
        alert(`Error: ${responseData.msg || "Failed to save data"}`);
      }
    } catch (error) {
      setLoadingBarProgress(100);
      console.error("Error in handleSave:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    // Calculate age when the date of birth changes
    calculateAge(registrationData.dob);
  }, [registrationData.dob]);

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();

    // Check if the birthday hasn't occurred yet this year
    if (
      today.getMonth() < dobDate.getMonth() ||
      (today.getMonth() === dobDate.getMonth() &&
        today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

    // Update the age in the state
    setRegistrationData({ ...registrationData, age: age.toString() });
  };

  useEffect(() => {
    // Set the current date as default date on component mount
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    setRegistrationData((prevData) => ({
      ...prevData,
      admissionDate: formattedDate,
    }));
  }, []);

  return (
    <Container mt={5}>
      <LoadingBar
        progress={loadingBarProgress}
        color="rgb(152, 106, 182)"
        height={5}
      />
      <AppBar
        position="static"
        style={{ backgroundColor: "#0B1F3D", marginBottom: "15px" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div">
            New Admission
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="financialYearLabel">Session</InputLabel>
            <Select
              labelId="financialYearLabel"
              id="financialYear"
              value={registrationData.financialYearID}
              label="Session"
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  financialYearID: e.target.value,
                })
              }
              helperText={
                errors.financialYearID ? (
                  <span style={{ color: "red" }}>Please Select Session</span>
                ) : (
                  ""
                )
              }
            >
              <MenuItem value="">
                <em>Select year</em>
              </MenuItem>
              {financialYears.map((year) => (
                <MenuItem
                  key={year.financialYearID}
                  value={year.financialYearID}
                >
                  {year.finanacialYear}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        alignItems="center"
        style={{ marginTop: "-5px" }}
      >
        <Grid item xs={12} sm={6}>
          <label htmlFor="registrationNo">
            <Typography variant="subtitle1">Registration No</Typography>
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              type="text"
              id="registrationNo"
              name="registrationNo"
              variant="outlined"
              fullWidth
              value={registrationData.registrationNo}
              //onChange={(e) => setRegistrationNo(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={fetchRegistration}
              style={{ marginLeft: "8px" }}
            >
              🔍
            </Button>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} marginTop="11px">
          {/* Registration Date */}
          <TextField
            id="registrationDate"
            label="Registration Date"
            type="date"
            variant="outlined"
            value={registrationData.dated}
            fullWidth
            InputProps={{ readOnly: true }}
            style={{ marginTop: "8px" }} // If registrationDate is read-only
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} style={{ marginTop: "11px" }}>
          {/* Admission Date */}
          <TextField
            label="Admission Date"
            id="admissionDate"
            variant="outlined"
            type="date"
            value={registrationData.admissionDate}
            className="form-control"
            onChange={(e) => {
              const selectedDate = e.target.value;
              // No need to format the date here
              setRegistrationData({
                ...registrationData,
                admissionDate: selectedDate,
              });
            }}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginTop: "8px" }} // Adjust the marginTop as needed
          />
        </Grid>
      </Grid>
      <div>
        <AppBar
          position="static"
          style={{ backgroundColor: "#0B1F3D" }}
          className=" mt-4"
        >
          <Toolbar>
            <Typography variant="h6" component="div">
              Student Details
            </Typography>
          </Toolbar>
        </AppBar>
      </div>

      <Grid
        container
        spacing={3}
        className="mt-3"
        style={{ marginTop: "-7px" }}
      >
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Admission No."
            id="admissionNo"
            value="New"
            //style={{backgroundColor: '#e3e3e3', color: 'red', marginTop: "10px"}}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                admissionNo: e.target.value,
              })
            }
            InputProps={{
              style: {
                backgroundColor: "#e3e3e3", // Background color
                color: "red", // Text color
              },
            }}
          />

          {/* <TextField
                        fullWidth
                        label="Admission No."
                        id="admissionNo"
                        value={registrationData.admissionNo}
                        onChange={handleAdmissionNoChange}
                        InputProps={{
                            style: {
                                backgroundColor: '#e3e3e3', // Background color
                                color: 'red' // Text color
                            }
                        }}
                        error={!!errors.admissionNo}
                        helperText={errors.admissionNo}
                        
                    /> */}
        </Grid>
        <Grid item xs={6}>
          <form>
            <div className="form-group">
              <Typography variant="subtitle1" gutterBottom>
                {" "}
                Students's Profile
              </Typography>
              <Input
                type="file"
                className="form-control-file"
                id="studentprofile"
                onChange={(e) => handleFileChange("studentprofile", e)}
              />
            </div>
            <div style={{ marginLeft: "-46px" }}>
              {/* <button
                                type="button"
                                className="mt-2 mx-5 btn btn-primary btn-sm"
                            >
                                <b>Uplaod Profile</b>
                            </button> */}
            </div>
          </form>
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="First name*"
            id="firstName"
            // inputProps={{
            //     style: {
            //         width: "200px",
            //         height: "13px",
            //     },
            // }}
            value={registrationData.name}
            onChange={(e) =>
              setRegistrationData({ ...registrationData, name: e.target.value })
            }
            helperText={
              errors.name ? (
                <span style={{ color: "red" }}>First name is required</span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Last Name"
            id="lastName"
            value={registrationData.lname}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                lname: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="class">Class</InputLabel>
            {/* <Select
              id="class"
            
              value={registrationData.classId}
              label="Class"
            
              onChange={handleClassChange}
          
            > */}
            <Select
              id="class"
              value={registrationData.classId}
              label="Class"
              onChange={handleClassChange}
              helperText={
                errors.classId ? (
                  <span style={{ color: "red" }}>Class is required</span>
                ) : (
                  ""
                )
              }
            >
              <MenuItem value="">Select Class</MenuItem>
              {ddlClass.map((item) => (
                <MenuItem key={item.classId} value={item.classId}>
                  {item.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="section">Section</InputLabel>
            {/* <Select
              id="section"
              value={registrationData.sectionId}
              label="Section"
              onChange={(e) => {
                handleSectionChange(e);
                
                fetchRollno();
              }}
            > */}
            <Select
              id="section"
              label="Section"
              value={registrationData.sectionId}
              onChange={(e) => {
                handleSectionChange(e);
                fetchRollno(); // Trigger fetchRollno when section is selected
              }}
            >
              <MenuItem value="0">Select Section</MenuItem>
              {ddlSection.map((item) => (
                <MenuItem key={item.sectionId} value={item.sectionId}>
                  {item.sectionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <TextField
            label="Roll No"
            variant="outlined"
            id="rollNo"
            value={rollNo} // Value is coming from the state that holds the roll number
            onChange={(e) => {
              setRollNo(e.target.value); // Update rollNo state when user types
              checkDuplicateRollNo(e.target.value); // Call the API to check duplicate roll number
            }}
            fullWidth
          />
          {duplicateRollNoMessage && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {duplicateRollNoMessage}
            </div>
          )}
        </Grid>

        <Grid item xs={12} sm={3}>
          <label htmlFor="dob">
            <TextField
              type="date"
              id="dob"
              label="D.O.B"
              variant="outlined"
              fullWidth
              value={registrationData.dob}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  dob: e.target.value,
                })
              }
              helperText={
                errors.dob ? (
                  <span style={{ color: "red" }}>
                    Please select date of birth
                  </span>
                ) : (
                  ""
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </label>
        </Grid>
        <Grid item xs={12} sm={3}>
          <label htmlFor="age">
            <TextField
              type="text"
              id="age"
              label="Age"
              variant="outlined"
              fullWidth
              value={registrationData.age}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  age: e.target.value,
                })
              }
              helperText={
                errors.age ? (
                  <span style={{ color: "red" }}>Age is required</span>
                ) : (
                  ""
                )
              }
            />
          </label>
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="nationality-label">Nationality</InputLabel>
            <Select
              labelId="nationality-label"
              id="nationality"
              label="Nationality"
              value={registrationData.nationalityId}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  nationalityId: e.target.value,
                })
              }
            >
              <MenuItem value="">Select Nationality</MenuItem>
              {nationality.map((item) => (
                <MenuItem key={item.nationalityId} value={item.nationalityId}>
                  {item.nationality}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="religion-label">Religion</InputLabel>
            <Select
              id="religion"
              //className="form-select"
              value={registrationData.religionID}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  religionID: e.target.value,
                })
              }
            >
              <MenuItem value="">Select Religion</MenuItem>
              {religion.map((item) => (
                <MenuItem key={item.religionID} value={item.religionID}>
                  {item.religionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Email Id"
            id="emailId"
            value={registrationData.email}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                email: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Last School Attended"
            id="lastSchoolAttended"
            value={registrationData.lastSchoolAttended}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                lastSchoolAttended: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Certification No."
            id="certification No."
            value={registrationData.CertiNo}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                CertiNo: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Aadhar No."
            variant="outlined"
            fullWidth
            required
            value={registrationData.adharNO}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                adharNO: e.target.value,
              })
            }
            error={errors.adharNO}
            helperText="Aadhar number must be of 12 digits."
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              label="Gender"
              value={registrationData.genderId}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  genderId: e.target.value,
                })
              }
            >
              <MenuItem value="">Select Gender</MenuItem>
              {gender.map((item) => (
                <MenuItem key={item.genderId} value={item.genderId}>
                  {item.gender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Mobile No."
            id="mobileNo."
            value={registrationData.mobileNo}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                mobileNo: e.target.value,
              })
            }
            helperText={
              errors.mobileNo ? (
                <span style={{ color: "red" }}>Mobile Number is required</span>
              ) : (
                ""
              )
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="bloodgroup">Blood Group</InputLabel>
            <Select
              labelId="bloodgroup-label"
              id="bloodgroup"
              label="Blood Group"
              value={registrationData.bloodGroupId}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  bloodGroupId: e.target.value,
                })
              }
            >
              <MenuItem value="">Select Blood Group</MenuItem>
              {bloodgrp.map((item) => (
                <MenuItem key={item.bloodGroupId} value={item.bloodGroupId}>
                  {item.bloodGroupName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="country">Country</InputLabel>
            <Select
              labelId="country-label"
              id="country"
              label="Country"
              value={registrationData.countryId}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  countryId: e.target.value,
                })
              }
            >
              <MenuItem value="">Select Country</MenuItem>
              {country.map((item) => (
                <MenuItem key={item.countryId} value={item.countryId}>
                  {item.countryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="state">State</InputLabel>
            <Select
              labelId="state-label"
              id="state"
              label="State"
              value={registrationData.stateId}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  stateId: e.target.value,
                })
              }
            >
              <MenuItem value="">Select State</MenuItem>
              {state.map((item) => (
                <MenuItem key={item.stateId} value={item.stateId}>
                  {item.stateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="city">City</InputLabel>
            <Select
              labelId="city-label"
              id="city"
              label="City"
              value={registrationData.cityId}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  cityId: e.target.value,
                })
              }
            >
              <MenuItem value="">Select City</MenuItem>
              {city.map((item) => (
                <MenuItem key={item.cityId} value={item.cityId}>
                  {item.cityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sx={{ marginTop: 5 }}>
          <TextField
            id="address"
            label="Address"
            value={registrationData.address}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                address: e.target.value,
              })
            }
            fullWidth
          />
        </Grid>

        <Grid item md={6} sx={{ marginTop: 5 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor="paymentType">Payment Type</InputLabel>
            <Select
              label="Payment Type"
              id="paymentType"
              value={registrationData.paymentType}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  paymentType: e.target.value,
                })
              }
            >
              <MenuItem value="0">General</MenuItem>
              <MenuItem value="1">Annual</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {registrationData.paymentType === "1" && (
        <Grid container spacing={3}>
          <Grid item md={6} sx={{ marginTop: 5 }}>
            <TextField
              id="annualAmount"
              label="Annual Amount"
              value={registrationData.annualAmount}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  annualAmount: e.target.value,
                })
              }
              fullWidth
              error={errors.annualAmount}
              helperText={
                errors.annualAmount ? "Annual Amount is required" : ""
              }
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3} className="mt-3">
        <Grid item xs={6}>
          <FormControl fullWidth error={Boolean(errors.casteId)}>
            <InputLabel htmlFor="caste">Caste</InputLabel>
            <Select
              labelId="caste-label"
              id="caste"
              label="Caste"
              value={registrationData.casteId}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  casteId: e.target.value,
                })
              }
            >
              <MenuItem value="">
                <em>Select Caste</em>
              </MenuItem>
              {caste.length === 0 ? (
                <MenuItem disabled>No caste records found</MenuItem> // Show message when no data
              ) : (
                caste.map((item) => (
                  <MenuItem key={item.casteId} value={item.casteId}>
                    {item.casteName}
                  </MenuItem>
                ))
              )}
            </Select>
            {/* Display the error message here */}
            {errors.casteId && (
              <Typography variant="caption" color="error">
                Please select Caste
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          {" "}
          {/* Adding the EWS dropdown here */}
          <FormControl fullWidth>
            <InputLabel htmlFor="ews">EWS</InputLabel>
            <Select
              labelId="ews-label"
              id="ews"
              label="EWS"
              value={registrationData.ews}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  ews: e.target.value,
                })
              }
            >
              <MenuItem value="">
                <em>Select EWS</em>
              </MenuItem>
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark mt-4">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">
                            Parents Details
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div
                            className="collapse navbar-collapse"
                            id="navbarSupportedContent"
                        >
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                        </div>
                    </div>
                </nav>
            </div> */}

      <div>
        <AppBar
          position="static"
          style={{ backgroundColor: "#0B1F3D" }}
          className="mt-4"
        >
          <Toolbar>
            <Typography variant="h6" component="div">
              Parents Details
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Father Name"
            id="name"
            value={registrationData.fatherName}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                fatherName: e.target.value,
              })
            }
            helperText={
              errors.name ? (
                <span style={{ color: "red" }}>Father name is required</span>
              ) : (
                ""
              )
            }
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Mother Name"
            id="name"
            value={registrationData.MotherName}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                MotherName: e.target.value,
              })
            }
            helperText={
              errors.name ? (
                <span style={{ color: "red" }}>Mother name is required</span>
              ) : (
                ""
              )
            }
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Father's Mobile No.*"
            id="fmobileNo"
            value={registrationData.fatherMobile}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                fatherMobile: e.target.value,
              })
            }
            helperText={
              errors.fatherMobile ? (
                <span style={{ color: "red" }}>
                  Father's Mobile Number is required
                </span>
              ) : (
                ""
              )
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={copyStudentMobile}
                onChange={handleCopyStudentMobileChange}
              />
            }
            label="Same as Student's Mobile Number"
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Mother's Mobile No."
            id="mmobileNo"
            value={registrationData.MotherMobile}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                MotherMobile: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Email Id"
            id="femailId"
            value={registrationData.Femail}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                Femail: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Email Id"
            id="memailId"
            value={registrationData.Memail}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                Memail: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="profession">Profession</InputLabel>
            <Select
              id="profession"
              value={registrationData.FatheroccupationID}
              label="Profession"
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  FatheroccupationID: e.target.value,
                })
              }
            >
              <MenuItem value="">Select Occupation</MenuItem>
              {occupation.map((item) => (
                <MenuItem key={item.occupationID} value={item.occupationID}>
                  {item.occupationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="profession">Profession</InputLabel>
            <Select
              id="profession"
              value={registrationData.MotheroccupationID}
              label="Profession"
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  MotheroccupationID: e.target.value,
                })
              }
            >
              <MenuItem value="">Select Occupation</MenuItem>
              {occupation.map((item) => (
                <MenuItem key={item.occupationID} value={item.occupationID}>
                  {item.occupationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Guardian's Name"
            id="name"
            value={registrationData.grandFather}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                grandFather: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Father's Income"
            id="Fincome"
            value={registrationData.FIncome}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                FIncome: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Mother's Income"
            id="mothersIncome"
            value={registrationData.MIncome}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                MIncome: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      {/* <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Income"
            id="Fincome"
            value={registrationData.fathersIncome}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                fathersIncome: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Income"
            id="mothersIncome"
            value={registrationData.mothersIncome}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                mothersIncome: e.target.value,
              })
            }
          />
        </Grid>
      </Grid> */}
      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Aadhar No."
            id="aadharNo"
            value={registrationData.FAadhar}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                FAadhar: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Aadhar No."
            id="aadharNo"
            value={registrationData.MAadhar}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                MAadhar: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={parentsDobChecked}
              onChange={() => setParentsDobChecked(!parentsDobChecked)}
              id="defaultCheck1"
            />
          }
          label={<b>Parents DOB</b>}
          style={{ marginTop: "20px" }}
        />

        {parentsDobChecked && (
          <Grid container spacing={2} className="mt-3">
            <Grid item xs={6}>
              <TextField
                id="fatherDob"
                label="Father's DOB"
                type="date"
                value={registrationData.fdob}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    fdob: e.target.value,
                  })
                }
                fullWidth
                InputLabelProps={{ shrink: true }} // Add this line
                style={{ marginBottom: "20px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="motherDob"
                label="Mother's DOB"
                type="date"
                value={registrationData.mdob}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    mdob: e.target.value,
                  })
                }
                fullWidth
                InputLabelProps={{ shrink: true }} // Add this line
                style={{ marginBottom: "20px" }}
              />
            </Grid>
          </Grid>
        )}
      </div>

      {/* Father's Address Field with Checkbox */}
      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Father's Address"
            id="faddress"
            value={registrationData.Faddress}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                Faddress: e.target.value,
              })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={copyStudentAddressForFather}
                onChange={handleCopyStudentAddressForFatherChange}
              />
            }
            label="Same as Student's Address"
          />
        </Grid>
      </Grid>

      {/* Mother's Address Field with Checkbox */}
      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Mother's Address"
            id="maddress"
            value={registrationData.Maddress}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                Maddress: e.target.value,
              })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={copyStudentAddressForMother}
                onChange={handleCopyStudentAddressForMotherChange}
              />
            }
            label="Same as Student's Address"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} className="mt-3">
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Father's Profile
          </Typography>
          <Input
            type="file"
            id="fatherprofile"
            onChange={(e) => handleFileChange("fatherprofile", e)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Mother's Profile
          </Typography>
          <Input
            type="file"
            id="motherprofile"
            onChange={(e) => handleFileChange("motherprofile", e)}
            fullWidth
          />
          <div style={{ marginLeft: "20px" }}>
            {/* <button type="button" className="mt-2 mx-5 btn btn-primary btn-sm">
              <b>Uplaod Profile</b>
            </button> */}
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2} className="mt-3">
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom className="mt-4">
            <b>Choose Stream</b>
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="instruction-label">Stream</InputLabel>
            <Select
              labelId="instruction-label"
              id="instruction"
              label="Medium Of Instruction"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
            >
              {streams.length === 0 ? (
                <MenuItem disabled>No streams available</MenuItem>
              ) : (
                streams.map((stream) => (
                  <MenuItem key={stream.streamID} value={stream.streamName}>
                    {stream.streamName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Dialog for displaying error */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" gutterBottom className="mt-4">
        <b>Concession Details</b>
      </Typography>

      <Grid container spacing={2} className="mt-3">
        <Grid item xs={12} md={6}>
          <label htmlFor="concession" className="form-label">
            Concession
          </label>
          <Select
            id="concession"
            value={selectedConcession}
            onChange={(e) => setSelectedConcession(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Select Concession Type</MenuItem>
            {concessionData.map((item) => (
              <MenuItem key={item.concessionId} value={item.concessionName}>
                {item.concessionName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <label htmlFor="selectedMonth" className="form-label">
            Select Month
          </label>
          <Select
            id="selectedMonth"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Select Month</MenuItem>
            <MenuItem value="All">Select All Months</MenuItem>{" "}
            {/* Add this for selecting all months */}
            {month.map((item) => (
              <MenuItem key={item.monthId} value={item.month}>
                {item.month}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={2}>
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <div className="flex">
            <Input
              type="text"
              id="amount"
              placeholder="Enter Amount"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
              fullWidth
            />
            <Button
              className="ml-2"
              variant="contained"
              color="warning"
              onClick={handleAddItem}
              disabled={
                !selectedConcession ||
                !selectedMonth ||
                !selectedAmount ||
                isNaN(selectedAmount)
              }
            >
              +
            </Button>
          </div>
        </Grid>
        {selectedItems.length > 0 && (
          <Grid item xs={12} mt={3}>
            <Typography variant="h5" gutterBottom>
              Selected Items
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Serial No</TableCell>
                  <TableCell>Concession Type</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.concession}</TableCell>
                    <TableCell>{item.month}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteItem(index)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        )}
      </Grid>

      {/* <Typography variant="h6" className="mt-3">
        <b>Avail Transport</b>
      </Typography>

      <Grid container spacing={2} className="mt-3">
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={isTransport}
                onChange={handleTransportChange}
              />
            }
            label={
              <Typography variant="body1">
                <b>Is Transport</b>
              </Typography>
            }
            style={{ marginLeft: "10px" }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} className="mt-3">
        <Grid item md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="route">Route</InputLabel>
            <Select
              id="route"
              value={registrationData.fathersOccupationId}
              label="Route"
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  fathersOccupationId: e.target.value,
                })
              }
            >
              <MenuItem value="lightOptionValue">Select Route</MenuItem>
              <MenuItem value="option1">A</MenuItem>
              <MenuItem value="option2">B</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="route">
              Select Pick and Drop location
            </InputLabel>
            <Select
              id="route"
              value={registrationData.mothersOccupationId}
              label="Select Pick and Drop location"
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  mothersOccupationId: e.target.value,
                })
              }
            >
              <MenuItem value="lightOptionValue">Select Pick and Drop</MenuItem>
              <MenuItem value="option1">B</MenuItem>
              <MenuItem value="option2">C</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid> */}

      {/* <Grid container spacing={2} className="mt-3">
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox checked={isHostel} onChange={handleHostelChange} />
            }
            label={
              <Typography variant="body1">
                <b>Is Hostel</b>
              </Typography>
            }
            style={{ marginLeft: "10px" }}
          />
        </Grid>
      </Grid> */}

      {/* <div className="col-md-6">
<label htmlFor="route" className="form-label">
Route
</label>
<select
id="route"
className="form-select"
value={selectedValue}
onChange={(e) => setSelectedValue(e.target.value)}
>
<option value="lightOptionValue">Select Route</option>
<option value="option1">A</option>
<option value="option2">B</option>
</select>
</div>
<div className="col-md-6">
<label htmlFor="profession" className="form-label">
Select Pick and Drop location
</label>
<select
id="profession"
className="form-select"
value={selectedValue}
onChange={(e) => setSelectedValue(e.target.value)}
>
<option value="lightOptionValue">Select Pick and Drop</option>
<option value="option1">B</option>
<option value="option2">C</option>
</select>
</div> */}
      <Typography variant="h6" className="mt-3">
        <b>Document</b>
      </Typography>

      <Grid container spacing={3}>
        {/* Aadhar Card Front */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" gutterBottom>
            Aadhar Card Front
          </Typography>
          <form>
            <div className="form-group">
              <Typography variant="subtitle1" gutterBottom></Typography>
              <Input
                type="file"
                className="form-control-file"
                id="aadharCardFront"
                onChange={(e) => handleFileChange("aadharCardFront", e)}
              />
            </div>
          </form>
        </Grid>

        {/* Aadhar Card Back */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" gutterBottom>
            Aadhar Card Back
          </Typography>
          <form>
            <div className="form-group">
              <Typography variant="subtitle1" gutterBottom></Typography>
              <Input
                type="file"
                className="form-control-file"
                id="aadharCardBack"
                onChange={(e) => handleFileChange("aadharCardBack", e)}
              />
            </div>
          </form>
        </Grid>

        {/* Birth Certificate */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" gutterBottom>
            Birth Certificate
          </Typography>
          <form>
            <div className="form-group">
              <Typography variant="subtitle1" gutterBottom></Typography>
              <Input
                type="file"
                className="form-control-file"
                id="birthCertificate"
                onChange={(e) => handleFileChange("birthCertificate", e)}
              />
            </div>
          </form>
        </Grid>

        {/* Transfer Certificate */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" gutterBottom>
            Transfer Certificate
          </Typography>
          <form>
            <div className="form-group">
              <Typography variant="subtitle1" gutterBottom></Typography>
              <Input
                type="file"
                className="form-control-file"
                id="transferCertificate"
                onChange={(e) => handleFileChange("transferCertificate", e)}
                required
              />
            </div>
          </form>
        </Grid>

        {/* Others */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" gutterBottom>
            Others
          </Typography>

          <form>
            <div className="form-group">
              <Typography variant="subtitle1" gutterBottom></Typography>
              <Input
                type="file"
                className="form-control-file"
                id="others"
                onChange={(e) => handleFileChange("others", e)}
              />
            </div>
          </form>
        </Grid>
      </Grid>

      <div
        className="mt-3 row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="col-md-6">
          <button
            type="button"
            className="mt-2 mx-2 btn btn-success"
            onClick={handleSave}
          >
            <b>Save</b>
          </button>
          <button
            type="button"
            className="mt-2 mx-2 btn btn-danger"
            onClick={resetForm} // Add onClick handler
          >
            <b>Reset</b>
          </button>
        </div>
      </div>

      {/* Modal for displaying fetched data */}
      <Dialog open={showModal} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: "#3498db", color: "#fff" }}>
          Registration Details
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Registration No</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Registration Date</TableCell>
                  <TableCell>Mobile No</TableCell>
                  <TableCell>Action</TableCell>{" "}
                  {/* New column for the action button */}
                </TableRow>
              </TableHead>
              <TableBody>
                {regisData.map((registration) => (
                  <TableRow key={registration.registrationId}>
                    <TableCell>{registration.registrationNo}</TableCell>
                    <TableCell>{registration.name}</TableCell>
                    <TableCell>{registration.dated}</TableCell>
                    <TableCell>{registration.mobileNo}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() =>
                          handleRowSelection(
                            registration,
                            registration.registrationId
                          )
                        }
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions style={{ borderTop: "none" }}>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog Popup for mandatory field error */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Mandatory Fields Missing</DialogTitle>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddAdmission;
