import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import LoadingBar from "react-top-loading-bar";
import { useParams } from "react-router-dom";
import {
    Container,
    Typography,
    Select,
    Grid,
    TextField,
    FormGroup,
    FormControlLabel,
    TableCell,
    TableBody,
    TableRow,
    Table,
    TableHead,
    MenuItem,
    Input,
    FormControl,
    Checkbox,
    InputLabel,
    IconButton,
    Toolbar,
    AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
// import { DatePicker, LocalizationProvider } from "@mui/lab";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";

const UpdateAdmission = () => {
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
    const [rollNo, setRollNo] = useState([]);
    const [occupation, setOccupation] = useState([]);
    const [gender, setGender] = useState([]);
    const [bloodgrp, setBloodgrp] = useState([]);
    const [concessionData, setConcessionData] = useState([]);
    const [month, setMonth] = useState([]);
    const [isTransport, setIsTransport] = useState(false);
    const [isHostel, setIsHostel] = useState(false);
    const [loadingBarProgress, setLoadingBarProgress] = useState(0);
    const [registrationData, setRegistrationData] = useState({
        admissionDate: '',
        admissionNo: '',
        financialYearID: '',
        registrationNo: '',
        dated: '',
        studentName: '',
        studentLastName: '',
        classId: '',
        sectionId: '',
        newRollNo: '',
        dob: '',
        age: '',
        emailId: '',
        adhaarNo: '',
        certificateNo: '',
        mobileNo: '',
        address: '',
        nationalityId: '',
        religionId: '',
        countryId: '',
        stateId: '',
        cityId: '',
        genderId: '',
        bloodGourpId: '',
        lastSchoolAttended: '',
        paymentType: '',
        fathersNmae: '',
        fdob: '',
        mdob: '',
        isTransport: '',
        isHostel: '',
        annualAmount: '',
        mothersName: '',
        fathersMobile: '',
        mothersMobile: '',
        fathersEmail: '',
        mothersEmail: '',
        grandFathersNmae: '',
        fathersIncome: '',
        mothersIncome: '',
        fathersAdhaar: '',
        mothersAdhaar: '',
        fathersAddress: '',
        mothersAddress: '',
        parentsDobChecked: false,
        mothersOccupationId: '',
        fathersOccupationId: '',
        studentImagePath: null,
        mothersImagePath: null,
        fathersImagePath: null,
        studentAdhaarFrontPath: null,
        studentAdhaarBackPath: null,
        birtcertificatePath: null,
        trfCertificatePath: null,
        othetFilePath: null,
    });
    const [selectedConcession, setSelectedConcession] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedAmount, setSelectedAmount] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [duplicateRollNoMessage, setDuplicateRollNoMessage] = useState('');
    const [streams, setStreams] = useState([]);
    const [selectedStream, setSelectedStream] = useState([]);
    const { studentId } = useParams();
    const navigate = useNavigate();

    const handleRollNoChange = (e) => {
        const rollNoValue = e.target.value;
        setRollNo(rollNoValue);
    };

    const checkDuplicateRollNo = async (rollNo) => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Admission/CheckDuplicateRollNo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    classId: registrationData.classId,
                    sectionId: registrationData.sectionId,
                    rollNo: Number(rollNo),
                    sessionId: registrationData.financialYearID?.[0] || null,
                }),
            });

            const data = await response.json();

            if (data.message === 'Roll number already exists.') {
                setDuplicateRollNoMessage('Roll number is already taken.');
            } else {
                setDuplicateRollNoMessage('');
            }
        } catch (error) {
            console.error('Error checking duplicate roll number:', error);
        }
    };


    const handleAddItem = () => {
        if (selectedConcession && selectedMonth && selectedAmount && !isNaN(selectedAmount)) {
            const selectedConcessionObject = concessionData.find(item => item.concessionName === selectedConcession);

            if (selectedConcessionObject) {
                setSelectedItems((prevItems) => [
                    ...prevItems,
                    {
                        concessionId: selectedConcessionObject.concessionId,
                        concession: selectedConcession,
                        month: selectedMonth,
                        amount: parseFloat(selectedAmount),
                    },
                ]);

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
        setRegistrationData((prevData) => ({
            ...prevData,
            [fieldName]: event.target.files[0],
        }));
    };

    const handleClassChange = (e) => {
        const selectedClassId = e.target.value;
        setRegistrationData((prevData) => ({
            ...prevData,
            classId: selectedClassId,
        }));
    };

    const handleSectionChange = (e) => {
        const selectedSectionId = e.target.value;
        setRegistrationData((prevData) => ({
            ...prevData,
            sectionId: selectedSectionId,
        }));
    }

    const fetchStudentData = async (selectedRegistration, registrationId) => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Admission/FillStudentDatabyId_Update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    "studentId": studentId
                }),
            });
            if (!response.ok) {
                throw new Error(`Error fetching financial years: ${response.status}`);
            }
            const data = await response.json();
            
           // Assuming `rollNo` is in `data.objData.rollNo`
        if (data.objData && data.objData.rollNo) {
            setRollNo(data.objData.rollNo); // Map the roll number to the field
        } else {
            console.warn('Roll number not found in response');
        }

        if (data.objData && data.objData.languageType) {
            setSelectedStream(data.objData.languageType); // Map the stream to the field
        } else {
            console.warn('stream not found in response');
        }
            setRegistrationData(data.objData);

            // Set the selected country separately
            // setRegistrationData((prevData) => ({
            //     ...prevData,
            //     countryId: data[0].countryId,
            //     stateId: data[0].stateId
            // }));
            // handleClose();
            //setSelectedValue(data[0]); // Assuming the API returns an array of options
        } catch (error) {
            console.error(error);
            handleClose();
        }
        console.log("Selected Registration:", registrationId);
    };

    const fetchFinancialYears = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/ClassPromotion/GetFinancialYear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error(`Error fetching financial years: ${response.status}`);
            }
            const data = await response.json();
            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
            }
            setFinancialYears(data);
            const currentYear = (new Date()).getFullYear();
            // Calculate the next year
            const nextYear = currentYear + 1;

            // Find the financial years that include the current year and next year
            const currentYearData = data.find(year => year.finanacialYear.includes(currentYear.toString()));
            const nextYearData = data.find(year => year.finanacialYear.includes(nextYear.toString()));

            // If the current year and next year are found, set them as the default selected values
            if (currentYearData && nextYearData) {
                setRegistrationData({
                    ...registrationData,
                    financialYearID: [nextYearData.financialYearID],
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRegistration = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Admission/FetchReg_Admission`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error(`Error fetching financial years: ${response.status}`);
            }
            const data = await response.json();
            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
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
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Nationality/GetNationality`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

            setNationality(data);
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    const fetchReligionData = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Religion/GetReligion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`Error fetching religion data: ${response.status}`);
            }

            const religionData = await response.json();

            if (religionData.data === null && religionData.msg === "Record Not Found") {
                return; // Exit the function if the record is not found
            }

            setReligion(religionData);
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const fetchCountry = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Registration/ddlCountry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    const fetchOcccupation = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Occupation/GetOccupation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`Error fetching religion data: ${response.status}`);
            }

            const data = await response.json();

            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
            }

            setConcessionData(data);
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
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
            // fetchRollno();
            setRollNo();
        }
    }, [registrationData.countryId, registrationData.stateId, registrationData.classId, registrationData.sectionId]);

    useEffect(() => {
        // Reset sectionId when classId changes
        setRegistrationData(prevData => ({
            ...prevData,
            sectionId: '0', // Reset to initial state or set to the default value

        }));
    }, [registrationData.classId]);


    const fetchState = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Registration/ddlState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    "countryId": registrationData.countryId
                }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching religion data: ${response.status}`);
            }

            const data = await response.json();

            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
            }

            setState(data);
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    const fetchCity = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Registration/ddlCity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    stateId: registrationData.stateId
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data === null && data.msg === 'Record Not Found') {
                    // Handle the case where no records are found
                    console.warn('No records found for sections');
                    // You can set a default value or perform any other necessary action
                    // For example, setddlSection([]) if an empty array is expected
                } else {
                    setCity(data);
                    //setSelectedValue(responseData.data[0]); // Assuming the API returns an array of options
                }
            } else {
                console.error('Failed to fetch nationality data');
            }
        } catch (error) {
            console.error('API request error:', error);
        }
    };

    const fetchddlClass = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error(`Error fetching financial years: ${response.status}`);
            }
            const data = await response.json();
            setddlClass(data);
            //setSelectedValue(data[0]); // Assuming the API returns an array of options
        } catch (error) {
            console.error(error);
        }
    };

    const fetchddlSection = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/ClassPromotion/ddlSection_clsId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    "teacherId": 0,
                    "classId": registrationData.classId
                }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching financial years: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.data === null && responseData.msg === 'Record Not Found') {
                // Handle the case where no records are found
                console.warn('No records found for sections');
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
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Admission/GetNewRollNo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    "classId": registrationData.classId,
                    "sectionId": registrationData.sectionId
                }),
            });
            if (!response.ok) {
                throw new Error(`Error fetching roll number: ${response.status}`);
            }
            const data = await response.json();
            // Check if the response is an array and extract the first item's newRollNo
            if (Array.isArray(data) && data.length > 0) {
                setRollNo(data[0].newRollNo);  // Extract and set the newRollNo
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const fetchGender = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Admission/ddlGender`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                }),
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
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Admission/ddlBloodGroup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                }),
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
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Concession/GetConcession`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error(`Error fetching religion data: ${response.status}`);
            }

            const data = await response.json();

            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
            }

            setConcessionData(data);
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const fetchMonth = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/Fine/GetMonthList`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error(`Error fetching financial years: ${response.status}`);
            }
            const data = await response.json();

            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
            }
            setMonth(data);
            // handleShow(); // Open the modal after fetching data
            //setSelectedValue(data[0]); // Assuming the API returns an array of options
        } catch (error) {
            console.error(error);
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
       // fetchStudentData();
    }, [])



    const formattedDate = (rawDate) => {
        const selectedDate = new Date(rawDate);
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const year = selectedDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
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
            body: JSON.stringify({}),
          });

          if (!response.ok) {
            throw new Error("Error fetching streams");
          }

          const data = await response.json();

          if (
            data.msg === "No records found." ||
            !Array.isArray(data) ||
            data.length === 0
          ) {
            setStreams([]);
            setSelectedStream(""); // Ensure selected stream is empty
          } else {
            setStreams(data);
            setSelectedStream(data[0]?.streamName || ""); // Default to first stream if available
          }
        } catch (error) {
          console.error("Error fetching streams:", error);
          setStreams([]);
          setSelectedStream("");
        }
      };

      fetchStreams();
    }, []);

    const handleSave = async () => {
        try {
            const Url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${Url}/Admission/Id?Id=${studentId}`;
            setLoadingBarProgress(30);
            const token = sessionStorage.getItem('token');

            // Create an array to hold concession details
            const concessionsDetail = selectedItems.map((item, index) => ({
                [`concessionsDetail[${index}].concessionTypeID`]: item.concessionId,
                [`concessionsDetail[${index}].charge`]: item.amount,
                [`concessionsDetail[${index}].month`]: item.month,
            }));

            // Flatten the array of objects into a single object
            const flattenedConcessionsDetail = Object.assign({}, ...concessionsDetail);

            const payload = {
                admissionDate: registrationData.admissionDate,
                studentFirstName: registrationData.studentName,
                studentLastName: registrationData.studentLastName,
                paymentType: registrationData.paymentType,
                registrationId: 0,
                admissionNo: registrationData.admissionNo,
                studentDOB: registrationData.dob,
                studentAge: registrationData.age,
                rollNo: rollNo,
                address: registrationData.address,
                emailId: registrationData.emailId,
                lastSchoolAttended: registrationData.lastSchoolAttended,
                trfCertificationNo: registrationData.certificateNo,
                studentAdhaarNo: registrationData.adhaarNo,
                languageType: selectedStream,
                studentMobile: registrationData.mobileNo,
                fetherMobile: 898989899,
                sessionId: registrationData.financialYearID || 4,
                classId: registrationData.classId,
                isHostel: true,
                isTransport: true,
                countryId: registrationData.countryId,
                routeId: 1,
                pickAndDropLocationId: 1,
                religionId: registrationData.religionId,
                stateId: registrationData.stateId,
                cityId: registrationData.cityId,
                nationalityId: registrationData.nationalityId,
                bloodGroupId: registrationData.bloodGourpId,
                genderId: registrationData.genderId,
                sectionId: registrationData.sectionId,
                studentAnualPack: registrationData.annualAmount || 0,
                'parentsDetails.isDob': parentsDobChecked,
                'parentsDetails.fatherName': registrationData.fathersNmae,
                'parentsDetails.fatherMobile': registrationData.fathersMobile,
                'parentsDetails.fatherEmail': registrationData.fathersEmail,
                'parentsDetails.fatherAddress': registrationData.fathersAddress,
                'parentsDetails.fatherDob': '01/01/2024',
                'parentsDetails.motherName': registrationData.mothersName,
                'parentsDetails.motherMobile': registrationData.mothersMobile,
                'parentsDetails.motherEmail': registrationData.mothersEmail,
                //   'parentsDetails.FatherOccupationId': 1,
                'parentsDetails.motherOccupation': registrationData.mothersOccupationId,
                'parentsDetails.motherAddress': registrationData.mothersAddress,
                'parentsDetails.motherDob': '01/01/2020',
                'parentsDetails.motherIncome': registrationData.mothersIncome,
                'parentsDetails.fatherIncome': registrationData.fathersIncome,
                'parentsDetails.granfatherName': registrationData.grandFathersNmae,
                'parentsDetails.fatherAdhaarNo': registrationData.fathersAdhaar,
                'parentsDetails.motherAdhaarNo': registrationData.mothersAdhaar,
                'parentsDetails.fatherOccupationId': registrationData.fathersOccupationId,
                'hostelDetails.hostelId': 0,
                'hostelDetails.roomNo': 1,
                'hostelDetails.bedNO': 1,
                ...flattenedConcessionsDetail, // Add flattenedConcessionsDetail
                "StudentImgPath": registrationData.studentImagePath,
                "OtherDocumentPath": registrationData.othetFilePath,
                "TranferDocumentPath": registrationData.trfCertificatePath,
                "AdharBackDocumentPath": registrationData.studentAdhaarBackPath,
                "AdharFrontDocumentPath": registrationData.studentAdhaarFrontPath,
                "MotherImgPath": registrationData.mothersImagePath,
                "FatherImgPath": registrationData.fathersImagePath,
                "BirthCertificateDocumentPath": registrationData.birtcertificatePath
            };

            const formData = new FormData();
            for (const key in payload) {
                formData.append(key, payload[key]);
            }

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (response.ok) {
                console.log("Form data successfully saved");
                setRegistrationData(""); // Clear form fields
                setSelectedStream(""); // Clear selected stream
                setLoadingBarProgress(100);
                alert("Data Updated Successfully");
          
                // Navigate to the admission page
                navigate("/admission/:encodedFormId");
                
            } else {
                setLoadingBarProgress(100);
                alert('An error occured')
            }
        } catch (error) {
            setLoadingBarProgress(100);
            alert('An error occurred. Please try again later.');
        }
    };

    useEffect(() => {
        // Calculate age when the date of birth changes
        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);


    useEffect(() => {
        // Calculate age when the date of birth changes
        if (registrationData.dob) {
        calculateAge(registrationData.dob);
        }
    }, [registrationData.dob]);

    // const calculateAge = (dob) => {
    //     const dobDate = new Date(dob);
    //     const today = new Date();
    //     let age = today.getFullYear() - dobDate.getFullYear();

    //     // Check if the birthday hasn't occurred yet this year
    //     if (today.getMonth() < dobDate.getMonth() || (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())) {
    //         age--;
    //     }

    //     // Update the age in the state
    //     setRegistrationData({ ...registrationData, age: age.toString() });
    // };


    const calculateAge = (dob) => {
    // Assuming dob is in the format "DD/MM/YYYY"
    const [day, month, year] = dob.split('/');
    const dobDate = new Date(`${year}-${month}-${day}`); // Convert to "YYYY-MM-DD" format

    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();

    // Check if the birthday hasn't occurred yet this year
    if (today.getMonth() < dobDate.getMonth() || 
        (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())) {
        age--;
    }

    // Update the age in the state
    setRegistrationData({ ...registrationData, age: age.toString() });
};



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
              Update Admission
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="financialYearLabel" shrink>
                Session
              </InputLabel>
              <Select
                native
                id="financialYear"
                value={registrationData.financialYearID}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    financialYearID: e.target.value,
                  })
                }
                style={{ marginTop: "10px" }} // Adjust the margin top as needed
              >
                <option>Select year</option>
                {financialYears.map((year) => (
                  <option
                    key={year.financialYearID}
                    value={year.financialYearID}
                  >
                    {year.finanacialYear}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          alignItems="center"
          style={{ marginTop: "-15px" }}
        >
          <Grid item xs={12} sm={6}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Registration No"
                type="text"
                id="registrationNo"
                name="registrationNo"
                variant="outlined"
                fullWidth
                value={registrationData.registrationNo}
                //onChange={(e) => setRegistrationNo(e.target.value)}

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

            {/* <InputLabel htmlFor="financialYearLabel" shrink>
                        Registration Date
                    </InputLabel> */}
            <TextField
              id="registrationDate"
              label="Registration Date"
              // type="date"
              value={registrationData.dated}
              variant="outlined"
              fullWidth
              // InputProps={{
              //     readOnly: true,
              // }}
            />
          </Grid>

          <Grid item xs={12} sm={6} marginTop="11px">
            {/* Admission Date */}
            {/* <TextField
            id="admissionDate"
            label="Admission Date"
            type="text"
            variant="outlined"
            inputProps={{
              style: {
                  width: '200px',
                  height: '13px'
              }
          }}
            value={registrationData.admissionDate}
            fullWidth
            onChange={(e) => {
              const selectedDate = e.target.value;
              setRegistrationData({
                ...registrationData,
                admissionDate: selectedDate,
              });
            }}
            style={{ marginTop: "8px" }}
          /> */}
            <TextField
              id="admissionDate"
              label="Admission Date"
              type="text"
              value={registrationData.admissionDate}
              variant="outlined"
              fullWidth
              onChange={(e) => {
                const selectedDate = e.target.value;
                setRegistrationData({
                  ...registrationData,
                  admissionDate: selectedDate,
                });
              }}
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
        <Grid container spacing={3} style={{ marginTop: "14px" }}>
          <Grid item xs={12} md={6}>
            <TextField
              id="admissionNo"
              label="Admission No."
              variant="outlined"
              value={registrationData.admissionNo}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  admissionNo: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <div></div>
            <div className="form-group" style={{ marginLeft: "7px" }}>
              <Input
                type="file"
                id="studentImagePath"
                onChange={(e) => handleFileChange("studentImagePath", e)}
              />
            </div>
            <div>
              {/* <Button
              type="button"
              variant="contained"
              color="primary"
              className="mt-2 mx-5"
              size="small"
            >
              <b>Upload Profile</b>
            </Button> */}
              <button type="button" className="mt-2 mx-2 btn btn-primary">
                <b>Upload Profile</b>
              </button>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} md={6}>
            <TextField
              id="firstName"
              label="First name"
              variant="outlined"
              value={registrationData.studentName}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  studentName: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="lastName"
              label="Last Name"
              variant="outlined"
              value={registrationData.studentLastName}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  studentLastName: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "-1px" }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="class-label">Class</InputLabel>
              <Select
                label="Class"
                labelId="class-label"
                id="class"
                value={registrationData.classId}
                onChange={handleClassChange}
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                label="Section"
                labelId="section-label"
                id="section"
                value={registrationData.sectionId}
                onChange={(e) => {
                  handleSectionChange(e);
                  // fetchRollno();
                }}
              >
                <MenuItem value="">Select Section</MenuItem>
                {ddlSection.map((item) => (
                  <MenuItem key={item.sectionId} value={item.sectionId}>
                    {item.sectionName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* <div className="col-md-6">
                    <label htmlFor="rollNo">RollNo</label>
                    {rollNo.map((registrationData) => (
                        <input type="text" className="form-control" id="rollNo" value={registrationData.newRollNo} />
                    ))}
                </div> */}
        {/* <Grid container spacing={3} style={{marginTop:"-1px"}}>
    <Grid item xs={12} md={6}>
        <TextField
            id="rollNo"
            label="RollNo"
            variant="outlined"
            value={registrationData.newRollNo}
            onChange={(e) => setRegistrationData()}
        />
    </Grid> */}
        <Grid container spacing={3} style={{ marginTop: "-1px" }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="RollNo"
              variant="outlined"
              id="rollNo"
              value={rollNo}
              onChange={handleRollNoChange}
              onBlur={() => checkDuplicateRollNo(rollNo)}
              helperText={duplicateRollNoMessage}
              error={!!duplicateRollNoMessage}
              fullWidth
              InputProps={{
                readOnly: true, // Make the field non-editable
                style: {
                  pointerEvents: "none", // Prevent interaction (e.g., click)
                  backgroundColor: "#f9f9f9", // Light background to mimic a regular field
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              id="dob"
              label="D.O.B"
              variant="outlined"
              value={registrationData.dob}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  dob: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              id="age"
              label="Age"
              variant="outlined"
              value={registrationData.age}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  age: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "-1px" }}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="religion-label">Religion</InputLabel>
              <Select
                labelId="religion-label"
                id="religion"
                label="Religion"
                value={registrationData.religionId}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    religionId: e.target.value,
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
        <Grid container spacing={3} style={{ marginTop: "-1px" }}>
          <Grid item xs={12} md={6}>
            <TextField
              id="emailId"
              label="Email Id"
              variant="outlined"
              value={registrationData.emailId}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  emailId: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="lastschoolattended"
              label="Last School Attended"
              variant="outlined"
              value={registrationData.lastSchoolAttended}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  lastSchoolAttended: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "-1px" }}>
          <Grid item xs={12} md={6}>
            <TextField
              id="certificationNo"
              label="Certification No."
              variant="outlined"
              value={registrationData.certificateNo}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  certificateNo: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="aadharNo"
              label="Aadhar No."
              variant="outlined"
              value={registrationData.adhaarNo}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  adhaarNo: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "-1px" }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                label="Gender"
                labelId="gender-label"
                id="gender"
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
          {/* <Grid item xs={12} md={6}>
        <TextField
            id="mobileNo"
            label="Mobile No."
            variant="outlined"
            value={registrationData.mobileNo}
            onChange={(e) => setRegistrationData({ ...registrationData, mobileNo: e.target.value })}
        />
    </Grid> */}
          <Grid item xs={12} md={6}>
            <TextField
              id="mobileNo"
              label="Mobile No."
              variant="outlined"
              value={registrationData.mobileNo}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  mobileNo: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="bloodgroup-label">Blood Group</InputLabel>
              <Select
                labelId="bloodgroup-label"
                id="bloodgroup"
                label="Blood Group"
                value={registrationData.bloodGourpId}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    bloodGourpId: e.target.value,
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="country-label">Country</InputLabel>
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
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="state-label">State</InputLabel>
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="city-label">City</InputLabel>
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
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="paymentType-label">Payment Type</InputLabel>
              <Select
                labelId="paymentType-label"
                id="paymentType"
                label="Payment Type"
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
          <Grid container spacing={3} style={{ marginTop: "1px" }}>
            <Grid item xs={12} md={6}>
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
              />
            </Grid>
          </Grid>
        )}
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
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="fatherName"
              label="Father Name"
              value={registrationData.fathersNmae}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  fathersName: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="motherName"
              label="Mother Name"
              value={registrationData.mothersName}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  mothersName: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="fathersMobile"
              label="Father's Mobile No."
              value={registrationData.fathersMobile}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  fathersMobile: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="mothersMobile"
              label="Mother's Mobile No."
              value={registrationData.mothersMobile}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  mothersMobile: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="fathersEmail"
              label="Father's Email Id"
              value={registrationData.fathersEmail}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  fathersEmail: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="mothersEmail"
              label="Mother's Email Id"
              value={registrationData.mothersEmail}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  mothersEmail: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "-1px" }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="fathersOccupationId">Profession</InputLabel>
              <Select
                fullWidth
                id="fathersOccupationId"
                value={registrationData.mothersOccupationId}
                label="Profession"
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    mothersOccupationId: e.target.value,
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
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="mothersOccupationId">Profession</InputLabel>
              <Select
                fullWidth
                id="mothersOccupationId"
                label="Profession"
                value={registrationData.fathersOccupationId}
                onChange={(e) =>
                  setRegistrationData({
                    ...registrationData,
                    fathersOccupationId: e.target.value,
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
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="grandFathersName"
              label="Guardian's Name"
              value={registrationData.grandFathersNmae}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  grandFathersNmae: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="fathersIncome"
              label="Father's Income"
              value={registrationData.fathersIncome}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  fathersIncome: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="mothersIncome"
              label="Mother's Income"
              value={registrationData.mothersIncome}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  mothersIncome: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="fathersAdhaar"
              label="Father's Aadhar No."
              value={registrationData.fathersAdhaar}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  fathersAdhaar: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="mothersAdhaar"
              label="Mother's Aadhar No."
              value={registrationData.mothersAdhaar}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  mothersAdhaar: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <div style={{ marginTop: "1px" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value={parentsDobChecked}
                  id="defaultCheck1"
                  onChange={() => setParentsDobChecked(!parentsDobChecked)}
                />
              }
              label={<b>Parents DOB</b>}
            />
          </FormGroup>
          {parentsDobChecked && (
            <Grid container spacing={2}>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          )}
        </div>
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="fatherAddress"
              label="Father's Address"
              multiline
              rows={3}
              value={registrationData.fathersAddress}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  fathersAddress: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="motherAddress"
              label="Mother's Address"
              multiline
              rows={3}
              value={registrationData.mothersAddress}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  mothersAddress: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "1px" }}>
          <Grid item xs={12} sm={6}>
            <label htmlFor="fathersImagePath"></label>
            <Input
              type="file"
              id="fathersImagePath"
              onChange={(e) => handleFileChange("fathersImagePath", e)}
            />
            <div style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="mt-2 mx-5 btn btn-primary btn-sm"
              >
                <b>Uplaod Profile</b>
              </button>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <label htmlFor="mothersImagePath"></label>
            <Input
              type="file"
              id="mothersImagePath"
              onChange={(e) => handleFileChange("mothersImagePath", e)}
            />
            <div style={{ marginTop: "10px" }}>
              <button
                type="button"
                className="mt-2 mx-5 btn btn-primary btn-sm"
              >
                <b>Uplaod Profile</b>
              </button>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3} className="mt-3">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom className="mt-4">
              <b>Choose Stream</b>
            </Typography>

            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="stream-label">Stream</InputLabel>
              <Select
                labelId="stream-label"
                id="stream-select"
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
              >
                {streams.length > 0 ? (
                  streams.map((stream) => (
                    <MenuItem key={stream.streamID} value={stream.streamName}>
                      {stream.streamName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No streams available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Typography
          variant="h5"
          component="h5"
          className="mt-4"
          fontWeight="bold"
        >
          Concession Details
        </Typography>
        <Grid container spacing={3} className="mt-3">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="concession-label">Concession</InputLabel>
              <Select
                labelId="concession-label"
                id="concession"
                label="Concession"
                value={selectedConcession}
                onChange={(e) => setSelectedConcession(e.target.value)}
              >
                <MenuItem value="">Select Concession Type</MenuItem>
                {concessionData.map((item) => (
                  <MenuItem key={item.concessionId} value={item.concessionName}>
                    {item.concessionName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="selectedMonth-label">Select Month</InputLabel>
              <Select
                labelId="selectedMonth-label"
                id="selectedMonth"
                label="Select Month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="">Select Month</MenuItem>
                {month.map((item) => (
                  <MenuItem key={item.monthId} value={item.month}>
                    {item.month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              id="amount"
              label="Amount"
              placeholder="Enter Amount"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
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
          </Grid>
          {selectedItems.length > 0 && (
            <Grid item xs={12} mt={3}>
              <Typography variant="h6">Selected Items</Typography>
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
                          color="error"
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
        <Typography
          variant="h6"
          component="h6"
          className="mt-3"
          fontWeight="bold"
        >
          Avail Transport
        </Typography>
        <Grid container spacing={3} className="mt-3">
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTransport}
                  onChange={handleTransportChange}
                  id="defaultCheck1"
                />
              }
              label={<b>Is Transport</b>}
              style={{ marginLeft: "10px" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="route-label">Route</InputLabel>
              <Select
                labelId="route-label"
                id="route"
                label="Route"
                // value={selectedRoute}
                // onChange={(e) => setSelectedRoute(e.target.value)}
              >
                <MenuItem value="">Select Route</MenuItem>
                <MenuItem value="option1">A</MenuItem>
                <MenuItem value="option2">B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="location-label">
                Select Pick and Drop location
              </InputLabel>
              <Select
                labelId="location-label"
                id="location"
                label="Select Pick and Drop location"
                // value={selectedLocation}
                // onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <MenuItem value="">Select Pick and Drop</MenuItem>
                <MenuItem value="option1">B</MenuItem>
                <MenuItem value="option2">C</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} className="mt-3">
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isHostel}
                  onChange={handleHostelChange}
                  id="defaultCheck1"
                />
              }
              label={<b>Is Hostel</b>}
              style={{ marginLeft: "10px" }}
            />
          </Grid>
        </Grid>
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
        <Typography
          variant="h6"
          component="h6"
          className="mt-3"
          fontWeight="bold"
        >
          Document
        </Typography>
        <Grid container spacing={3} className="mt-3">
          {/* Aadhar Card Front */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Aadhar Card Front
            </Typography>
            <FormControl fullWidth>
              <InputLabel htmlFor="studentAdhaarFrontPath"></InputLabel>
              <Input
                type="file"
                id="studentAdhaarFrontPath"
                onChange={(e) => handleFileChange("studentAdhaarFrontPath", e)}
              />
            </FormControl>
          </Grid>

          {/* Aadhar Card Back */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Aadhar Card Back
            </Typography>
            <FormControl fullWidth>
              <InputLabel htmlFor="studentAdhaarBackPath"></InputLabel>
              <Input
                type="file"
                id="studentAdhaarBackPath"
                onChange={(e) => handleFileChange("studentAdhaarBackPath", e)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Birth Certificate
            </Typography>
            <FormControl fullWidth>
              <InputLabel htmlFor="birthCertificate"></InputLabel>
              <Input
                type="file"
                id="birtcertificatePath"
                onChange={(e) => handleFileChange("birtcertificatePath", e)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Transfer Certificate
            </Typography>
            <FormControl fullWidth required>
              <InputLabel htmlFor="transferCertificate"></InputLabel>
              <Input
                type="file"
                id="trfCertificatePath"
                onChange={(e) => handleFileChange("trfCertificatePath", e)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Others
            </Typography>

            <FormControl fullWidth>
              <InputLabel htmlFor="others"></InputLabel>
              <Input
                type="file"
                id="othetFilePath"
                onChange={(e) => handleFileChange("othetFilePath", e)}
              />
            </FormControl>
          </Grid>
        </Grid>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid item xs={12} md={6}>
            <button
              type="button"
              className="mt-2 mx-2 btn btn-success"
              onClick={handleSave}
            >
              Save
            </button>
          </Grid>
          <Grid item xs={12} md={6}>
            <button type="button" className="mt-2 mx-2 btn btn-danger">
              Reset
            </button>
          </Grid>
        </div>
        {/* Modal for displaying fetched data */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#3498db", color: "#fff" }}
          >
            <Modal.Title>Registration Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Registration No</th>
                    <th>Student Name</th>
                    <th>Registration Date</th>
                    <th>Mobile No</th>
                    <th>Action</th> {/* New column for the action button */}
                  </tr>
                </thead>
                <tbody>
                  {regisData.map((registration) => (
                    <tr key={registration.registrationId}>
                      <td>{registration.registrationNo}</td>
                      <td>{registration.name}</td>
                      <td>{registration.dated}</td>
                      <td>{registration.mobileNo}</td>
                      <td>
                        {/* <Button variant="success" size="sm" onClick={() => handleRowSelection(registration, registration.registrationId)}>
                                                Select
                                            </Button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: "none" }}>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
};

export default UpdateAdmission;