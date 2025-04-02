import { Checkbox, Container,Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button, } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

let debounceTimer;

function FeeDeposit() {
  const [ddlClass, setDdlClass] = useState([]);
  const [isPartialPayment, setIsPartialPayment] = useState(true); // Default to partial payment
  const [showModal, setShowModal] = useState(false);
  const [showMoodal, setShowMoodal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(0);
  const [monthFeeDetails, setMonthFeeDetails] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);
  const [chargeDetails, setChargeDetails] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(""); // For holding the selected mode
  const [selectedPaymentModeName, setSelectedPaymentModeName] = useState("");
  const [loadingBarProgress, setLoadingBarProgress] = useState("");
  const [totalFine, setTotalFine] = useState("0.00");
  const [totalAmount, setTotalAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");
  const [concessionAmount, setConcessionAmount] = useState("0.00");
  const [amountAfterDiscount, setAmountAfterDiscount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("0.00");
  const [walleteAmount, setWalleteAmount] = useState("0.00");
  const [paidAmount, setPaidAmount] = useState("0.00");
  const [balance, setBalance] = useState(0);
  const [studentId, setStudentId] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthFee, setMonthFee] = useState([]);
  const [feeCharge, setFeeCharge] = useState([]);
  const [printData, setPrintData] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [extraAmount, setExtraAmount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMonthDialog, setShowMonthDialog] = useState(false); // For month selection error
  const [showPaidAmountDialog, setShowPaidAmountDialog] = useState(false); // For paid amount error

  const handleCloseMonthDialog = () => {
    setShowMonthDialog(false);
  };

  const handleClosePaidAmountDialog = () => {
    setShowPaidAmountDialog(false);
  };
  const [prevPaidAmount, setPrevPaidAmount] = useState(0);

  const [studentDetails, setStudentDetails] = useState({
    admissionNo: "",
    receiptDate: new Date().toISOString().substr(0, 10),
    className: "",
    studentName: "",
    fatherName: "",
    sectionName: "",
    classId: "",
    // Add other fields as needed
  });

  const [formValues, setFormValues] = useState({
    admissionNo: "",
    className: "",
    studentName: "",
    fatherName: "",
    sectionName: "",
    totalAmount: "",
    paidAmount: "",
    discountAmount: "",
    balance: "",
    paymentMode: "",
    concessionAmount: "",
    previousPaidAmount: "",
  });

  const resetForm = () => {
    setStudentDetails({});
    setFormValues({
     
      totalAmount: "",
      paidAmount: "",
      discountAmount: "",
      balance: "",
      paymentMode: "",
      concessionAmount: "",
      previousPaidAmount: "",
    });
  
    setChargeDetails([]);
    setMonthFeeDetails([]); // Reset monthFeeDetails to an empty array
    setAdmissionData([]); // Reset admission data if necessary
    setNoDataFound(false); // Reset the no-data flag
  };
  
  
  const handleMonthFeeChange = (index, fieldName, value) => {
    const updatedMonthFee = [...monthFee];
    updatedMonthFee[index][fieldName] = value;
    setMonthFee(updatedMonthFee);
  };

  const handleFeeChargeChange = (index, fieldName, value) => {
    const updatedFeeCharge = [...feeCharge];
    updatedFeeCharge[index][fieldName] = value;
    setFeeCharge(updatedFeeCharge);
  };

  const fetchClass = async () => {
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
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setDdlClass(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBank = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Bank/GetBank`, {
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
        throw new Error("Record Not Found");
      }

      // Set the bank data
      setBankData(data);

     // Auto-select "Cash" payment mode if available
    const cashBank = data.find(
        (item) => item.bankName.toLowerCase() === "cash"
      );
      if (cashBank) {
        setSelectedPaymentMode(cashBank.bankId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentModeChange = (event) => {
    const selectedBankId = event.target.value;
    const selectedBank = bankData.find((bank) => bank.bankId.toString() === selectedBankId);
  
    setSelectedPaymentMode(selectedBankId); // Update the payment mode ID
    setSelectedPaymentModeName(selectedBank?.bankName || ""); // Update the payment mode name
  };
    
  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    fetchAdmission(classId); // Pass the selected class ID to fetchAdmission
  };

  const fetchAdmission = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const endpoint = isPartialPayment
        ? "SerachAdmissionListMonthly"
        : "SerachAdmissionListAnual";

        setMonthFeeDetails([]); // Clear table data before fetching new data

      const response = await fetch(`${apiUrl}/FeeDeposit/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          classId: classId || 0,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === null && data.msg === "Record Not Found") {
        setNoDataFound(true);
        setAdmissionData([]);
      } else {
        setNoDataFound(false);
        setAdmissionData(data);
      }
      setShowModal(true); // Open the modal after fetching data
    } catch (error) {
      console.error(error);
      setNoDataFound(true);
      setShowModal(true);
    }
  };

  const fetchMonthFeeDetails = async (studentId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const endpoint = isPartialPayment
        ? "GetMonthFeeDetails"
        : "GetAnualFeeDetails";
      const apiUrl = `${url}/FeeDeposit/${endpoint}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          studentId: studentId,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching month fee details: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setMonthFeeDetails(data); // Update state with fetched data
      setSelectedClass("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const token = sessionStorage.getItem("token");
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeDeposit/GetAmountbyStudentId`;
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          studentId: studentId,
          monthId: 0,
          recieptDate: formattedDate,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching month fee details: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setStudentDetails(data.objData); // Update state with fetched data
      setStudentId(studentId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (event) => {
    setIsPartialPayment(event.target.value === "Partial Payment");
  };

  const handleSearchButtonClick = () => {
    fetchAdmission(); // Call the API when the search button is clicked
  };
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedClass("0"); // Reset the selected class ID to 0
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter the admissionData based on the searchTerm
  const filteredData = admissionData.filter((item) =>
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleClassChange = (event) => {
  //     setSelectedClass(event.target.value);
  //     fetchAdmission(event.target.value); // Pass the selected class ID to fetchAdmission
  // };

  const handleSelectButtonClick = (studentId) => {
    setSelectedStudentId(studentId);
    fetchMonthFeeDetails(studentId); // Call fetchMonthFeeDetails with the selected student ID
    fetchStudentDetails(studentId);
    setShowModal(false);
    resetForm(); // Reset the form and table states
  };
  // const handleAmountChange = (index, newValue) => {
  //     const updatedChargeDetails = [...chargeDetails];
  //     updatedChargeDetails[index].chargerAmount = newValue;
  //     setChargeDetails(updatedChargeDetails);
  // };

  // const handleAmountChange = (index, newValue) => {
  //     const updatedChargeDetails = [...chargeDetails];
  //     const previousAmount = updatedChargeDetails[index].chargerAmount; // Store the previous amount

  //        // Convert newValue to a number, or set it to 0 if it's not a valid number
  // const newAmount = parseFloat(newValue) || 0;

  //     // Update the chargerAmount with the new value
  //     updatedChargeDetails[index].chargerAmount = newAmount;

  //     // Calculate the difference between the new and old amounts
  //     const difference = newAmount - previousAmount;

  //     // Update the charge details state
  //     setChargeDetails(updatedChargeDetails);

  //     // Update the corresponding totalFee in monthFeeDetails based on the difference
  //     const updatedMonthFeeDetails = [...monthFeeDetails];
  //     const monthFeeIndex = updatedMonthFeeDetails.findIndex(
  //         fee => fee.monthId === updatedChargeDetails[index].monthId // Assuming monthId links chargeDetails to monthFeeDetails
  //     );
  //     if (monthFeeIndex !== -1) {
  //         updatedMonthFeeDetails[monthFeeIndex].totalFee += difference;
  //         setMonthFeeDetails(updatedMonthFeeDetails);
  //     }

  //     // Optionally, update the totalAmount if it's directly tied to the totalFee
  //     let newTotalAmount = 0;
  //     let newTotalFine = 0;
  //     updatedMonthFeeDetails.forEach(item => {
  //         if (item.isChecked) {
  //             newTotalAmount += item.totalFee + item.fine;
  //             newTotalFine += item.fine;
  //         }
  //     });
  //     setTotalAmount(newTotalAmount);
  //     setTotalFine(newTotalFine);
  // };

  const handleAmountChange = (index, newValue) => {
    const updatedChargeDetails = [...chargeDetails];
    const newAmount = parseFloat(newValue) || 0;

    updatedChargeDetails[index].chargerAmount = newAmount;
    setChargeDetails(updatedChargeDetails);

    const updatedMonthFeeDetails = [...monthFeeDetails];
    let newTotalAmount = 0;
    let newTotalFine = 0;
    let calculatedPrevPaidAmount = 0; // Track the previous paid amount

    updatedMonthFeeDetails.forEach((item) => {
        if (item.isChecked) {
            const relatedCharges = updatedChargeDetails.filter(
                (charge) => charge.monthId === item.monthId
            );
            const totalChargeAmount = relatedCharges.reduce(
                (sum, charge) => sum + charge.chargerAmount,
                0
            );

            const calculatedAmount = totalChargeAmount + item.fine - item.paidAmount;
            calculatedPrevPaidAmount += item.paidAmount; // Accumulate previous paid amounts
            newTotalAmount += Math.max(0, calculatedAmount); // Prevent negative total
            newTotalFine += item.fine;

            // Set up debouncing logic for validation
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (calculatedAmount < 0) {
                    setIsDialogOpen(true);
                }
            }, 3000); // 3-second delay
        }
    });

    setTotalAmount(newTotalAmount);
    setTotalFine(newTotalFine);
    setPrevPaidAmount(calculatedPrevPaidAmount); // Update the state
};


  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
;

  const handleCheckboxesChange = async (index, isChecked) => {
    // Toggle the checkbox value in the monthFeeDetails array
    const updatedMonthFeeDetails = [...monthFeeDetails];
    updatedMonthFeeDetails[index].isChecked = isChecked;
    setMonthFeeDetails(updatedMonthFeeDetails);

    // If checkbox is checked, make API call
    if (isChecked && !selectedMonth) {
      const item = monthFeeDetails[index];
      try {
        const token = sessionStorage.getItem("token");
        const url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${url}/FeeDeposit/GetClassCharger_MonthFee`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            feePaymentId: item.feePaymentId,
            studentId: selectedStudentId,
            classId: studentDetails.classId,
            monthId: item.monthId,
          }),
        });
        if (!response.ok) {
          throw new Error(
            `Error fetching month fee details: ${response.status}`
          );
        }
        const data = await response.json();

        // Update charge details based on the response
        const updatedChargeDetails = [...chargeDetails];
        data.forEach((newCharge) => {
          const existingChargeIndex = updatedChargeDetails.findIndex(
            (charge) => charge.chargerId === newCharge.chargerId
          );
          if (existingChargeIndex !== -1) {
            updatedChargeDetails[existingChargeIndex].chargerAmount +=
              newCharge.chargerAmount;
          } else {
            updatedChargeDetails.push(newCharge);
          }
        });
        setChargeDetails(updatedChargeDetails);

        // Calculate fine amount and update monthFeeDetails
        const fineAmount = await fetchFineAmount(
          selectedStudentId,
          item.monthId,
          item.date
        );
        const updatedMonthFeeDetails = [...monthFeeDetails];
        updatedMonthFeeDetails[index].fine = fineAmount;
        setMonthFeeDetails(updatedMonthFeeDetails);
      } catch (error) {
        console.error(error);
      }
    } else {
      // If checkbox is unchecked, subtract charge details related to the unchecked month
      const item = monthFeeDetails[index];
      try {
        const token = sessionStorage.getItem("token");
        const url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${url}/FeeDeposit/GetClassCharger_MonthFee`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            feePaymentId: item.feePaymentId,
            studentId: selectedStudentId,
            classId: studentDetails.classId,
            monthId: item.monthId,
          }),
        });
        if (!response.ok) {
          throw new Error(
            `Error fetching month fee details: ${response.status}`
          );
        }
        const data = await response.json();

        // Update charge details based on the response
        const updatedChargeDetails = [...chargeDetails];
        data.forEach((charge) => {
          const existingChargeIndex = updatedChargeDetails.findIndex(
            (c) => c.chargerId === charge.chargerId
          );
          if (existingChargeIndex !== -1) {
            updatedChargeDetails[existingChargeIndex].chargerAmount -=
              charge.chargerAmount;
          }
        });
        setChargeDetails(updatedChargeDetails);
      } catch (error) {
        console.error(error);
      }
    }
    // Check if all checkboxes are unchecked, reset chargeDetails if so
    const allUnchecked = updatedMonthFeeDetails.every(
      (item) => !item.isChecked
    );
    if (allUnchecked) {
      setChargeDetails([]); // Reset the chargeDetails to an empty array
    }

    let newTotalAmount = 0;
    let newTotalFine = 0;
    updatedMonthFeeDetails.forEach((item) => {
      if (item.isChecked) {
        newTotalAmount += item.totalFee + item.fine - item.paidAmount;
        newTotalFine += item.fine;
      }
    });
    setTotalAmount(newTotalAmount);
    setTotalFine(newTotalFine);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentDetails({
      ...studentDetails,
      [name]: value,
    });
  };
  // const handleInputChange = (e) => {
  //     const { id, value } = e.target;
  //     setStudentDetails({
  //         ...studentDetails,
  //         [id]: value
  //     });
  // };

  useEffect(() => {
    fetchClass();
    fetchBank();
    //fetchddlcharge();
  }, []);

  const formatDateForAPI = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleDateChange = async (index, newDate) => {
    // Convert newDate from yyyy-mm-dd to dd/mm/yyyy
    const formattedDate = formatDateForAPI(newDate);

    const updatedMonthFeeDetails = [...monthFeeDetails];
    updatedMonthFeeDetails[index].date = formattedDate; // Set the formatted date
    setMonthFeeDetails(updatedMonthFeeDetails);

    // Make API call to update fine amount
    try {
      const token = sessionStorage.getItem("token");
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeDeposit/FetchFineAmount`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          studentId: selectedStudentId,
          monthId: updatedMonthFeeDetails[index].monthId,
          recieptDate: formattedDate, // Use the formatted date for the API
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching fine amount: ${response.status}`);
      }
      const data = await response.json();

      // Update the fine amount in the monthFeeDetails state
      const updatedMonthFeeDetailsWithFine = [...updatedMonthFeeDetails];
      updatedMonthFeeDetailsWithFine[index].fine = data[0].fineAmount;
      setMonthFeeDetails(updatedMonthFeeDetailsWithFine);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFineAmount = async (studentId, monthId, newDate) => {
    try {
      const token = sessionStorage.getItem("token");
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeDeposit/FetchFineAmount`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          studentId: studentId,
          monthId: monthId,
          recieptDate: newDate,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching fine amount: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      return data[0].fineAmount;
    } catch (error) {
      console.error(error);
      return 0; // Return 0 if there's an error
    }
  };

  const calculateAmountAfterDiscount = () => {
    const total = parseFloat(totalAmount);
    const discount = parseFloat(discountAmount);
    const concession = parseFloat(concessionAmount);

    // Check if inputs are valid numbers
    if (!isNaN(total) && !isNaN(discount) && !isNaN(concession)) {
      const discountedAmount = total - discount - concession;
      setAmountAfterDiscount(discountedAmount.toString()); // Convert back to string for input field
    } else {
      setAmountAfterDiscount(""); // Reset amount if inputs are invalid
    }
  };

  // Function to handle change in discount amount
  const handleDiscountChange = (event) => {
    const inputValue = event.target.value;

    // Regular expression to allow only numbers and a maximum of 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    // Check if the input value matches the regular expression
    if (regex.test(inputValue)) {
      setDiscountAmount(inputValue);
    }
  };

  // Function to handle change in concession amount
  const handleConcessionChange = (event) => {
    setConcessionAmount(event.target.value);
  };

  const handleTotalAmountChange = (event) => {
    const inputValue = event.target.value;

    // Regular expression to allow only numbers and a maximum of 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    // Check if the input value matches the regular expression
    if (regex.test(inputValue)) {
      setTotalAmount(parseFloat(inputValue));
    }
  };

  const handlePaidAmountChange = (event) => {
    const inputValue = event.target.value;

    // Regular expression to allow only numbers and a maximum of 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    // Check if the input value matches the regular expression
    if (regex.test(inputValue)) {
      setPaidAmount(inputValue);
    }
  };

  // Call calculateAmountAfterDiscount whenever total, discount, or concession amount changes
  React.useEffect(() => {
    calculateAmountAfterDiscount();
  }, [totalAmount, discountAmount, concessionAmount]);

  // Function to calculate the amount after discount
  const calculateBalanceAmount = () => {
    const total = parseFloat(totalAmount);
    const discount = parseFloat(discountAmount);
    const concession = parseFloat(concessionAmount);

    // Check if inputs are valid numbers
    if (!isNaN(total) && !isNaN(discount) && !isNaN(concession)) {
      const discountedAmount = total - discount - concession;
      setAmountAfterDiscount(discountedAmount.toString()); // Convert back to string for input field
    } else {
      setAmountAfterDiscount(""); // Reset amount if inputs are invalid
    }
  };

  // Function to calculate the balance
  // Function to calculate the balance
  const calculateBalance = () => {
    const advance = parseFloat(advanceAmount) || 0;
    const paid = parseFloat(paidAmount) || 0;
    const amountAfterDiscountNum = parseFloat(amountAfterDiscount) || 0;

    let calculatedBalance = amountAfterDiscountNum - advance - paid;
    let extraAmountLocal = 0;

    if (calculatedBalance < 0) {
      extraAmountLocal = Math.abs(calculatedBalance);
      calculatedBalance = 0;
    }

    setBalance(calculatedBalance.toString());
    setExtraAmount(extraAmountLocal);
    console.log(extraAmountLocal);
  };

  // Function to handle change in advance amount
  const handleAdvanceChange = (event) => {
    setAdvanceAmount(event.target.value);
  };

  // Function to handle change in paid amount
  const handlePaidChange = (event) => {
    setPaidAmount(event.target.value);
  };

  // Call calculateAmountAfterDiscount whenever total, discount, or concession amount changes
  React.useEffect(() => {
    calculateBalanceAmount();
  }, [totalAmount, discountAmount, concessionAmount]);

  // Call calculateBalance whenever advance amount, paid amount, or amount after discount changes
  React.useEffect(() => {
    calculateBalance();
  }, [advanceAmount, paidAmount, amountAfterDiscount]);

const handleSave = async () => {
  const selectedMonths = monthFeeDetails.filter((item) => item.isChecked);
   // Check if no month is selected
   if (selectedMonths.length === 0) {
    setShowMonthDialog(true); // Show month selection error dialog
    return;
  }

  // Check if paid amount is empty or zero
  // if (parseFloat(paidAmount) === 0 || paidAmount === "") {
  //   setShowPaidAmountDialog(true); // Show paid amount error dialog
  //   return;
  // }

  const endpoint = isPartialPayment ? "FeeDepositMonthly" : "FeeDeposit";

  // Collect charge details
  const feeCharges = chargeDetails.map((item) => ({
    chargeId: item.chargerId,
    chargerAmount: item.chargerAmount,
  }));

  const sessionId = studentDetails.sessionId;
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  // Get values from input fields
  const admissionNo = document.getElementById("admissionNo").value;
  const className = document.getElementById("class").value;
  const studentName = document.getElementById("field4").value;
  const fatherName = document.getElementById("fatherName").value;
  const section = document.getElementById("section").value;
  const totalAmount = document.getElementById("amount").value;
  const paidAmount = document.getElementById("paidamount").value;
  const discountAmount = document.getElementById("discountAmout").value;
  const balance = document.getElementById("Balance").value;
  const paymentMode = document.getElementById("paymentMode").value;
  const concessionAmount = document.getElementById("Concession").value;
  const previousPaidAmount = document.getElementById("prevpaidAmnt").value;

  // Create payload object
  const payload = {
    walleteAmount: parseFloat(walleteAmount) || 0,
    paidStatus: true,
    feePaymentId: 0,
    studentId: studentId,
    advanceAmount: extraAmount,
    fineAmount: totalFine,
    paidAmount: parseFloat(paidAmount),
    month: "string",
    monthId: 0,
    sessionId: sessionId,
    checqueNo: "",
    checqueDate: "",
    paymentDate: formattedDate,
    paymentMode: selectedPaymentMode.toString(),
    paymentModeName: selectedPaymentModeName || "",
    balance: parseFloat(balance) || 0,
    discount: parseFloat(discountAmount),
    concessionAmount: parseFloat(concessionAmount) || 0,
    previousPaidAmount: prevPaidAmount,
  };

  if (endpoint !== "FeeDeposit") {
    payload.feeCharge = feeCharges;
    payload.monthFee = selectedMonths.map((item) => ({
      feePaymentId: item.feePaymentId,
      isMonthCheck: true,
      totalFee: totalAmount,
      paidAmount: item.paidAmount,
      month: item.monthName,
      fine: item.fine,
      paidStaus: item.paidStaus,
      monthId: item.monthId,
    }));
  }

  // Validate the paidAmount before proceeding
  // if (parseFloat(paidAmount) === 0 || paidAmount === "") {
  //   setDialogMessage(true);
  //   return;
  // }
   // Check if paid amount is empty or zero
   if (parseFloat(paidAmount) === 0 || paidAmount === "") {
    setShowPaidAmountDialog(true); // Show paid amount error dialog
    return;
  }

  try {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    setLoadingBarProgress(30);
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${apiUrl}/FeeDeposit/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setLoadingBarProgress(0);
      alert("Failed to deposit fee");
      setShowMoodal(false);
    } else {
      const data = await response.json();
      const paymentId = data.paymentId;
      handlePrintReceipt(paymentId);
      setShowMoodal(true);
      

      // Clear form fields
      resetForm();
      setMonthFeeDetails([]);
      setTotalAmount('');
      setPaidAmount('0.00');
      setTotalFine('0.00');
      setLoadingBarProgress(100);
      fetchMonthFeeDetails(studentId);
    }
  } catch (error) {
    console.error("Error occurred while saving data:", error);
  }
};

  const annualHandleSave = async () => {
    const sessionId = studentDetails.sessionId;
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;

    // Get values from input fields
    const totalAmount = document.getElementById("amount").value;
    const paidAmount = document.getElementById("paidamount").value;
    const discountAmount = document.getElementById("discountAmout").value;
    const balance = document.getElementById("Balance").value;
    const concessionAmount = document.getElementById("Concession").value;
    // const advanceAmount = document.getElementById('advanceamount').value;
    const paymentMode = document.getElementById("paymentMode").value;
    const previousPaidAmount = document.getElementById("prevpaidAmnt").value;

    // Create payload object
    const payload = {
      walleteAmount: parseFloat(studentDetails.walleteAmount) || 0,
      feePaymentId: 0,
      studentId: studentId, // Update student ID based on your logic
      advanceAmount: extraAmount,
      fineAmount: parseFloat(totalFine), // Assuming you handle fine amount separately
      paidAmount: parseFloat(paidAmount),
      month: "string", // Update month based on your logic
      sessionId: sessionId, // Update session ID based on your logic
      monthId: 0, // Update month ID based on your logic
      checqueNo: "0", // Update cheque number based on your logic
      checqueDate: "01/01/2020", // Update cheque date based on your logic
      paymentDate: formattedDate, // Update payment date based on your logic
      paymentMode: "string",
      paymentModeId: parseInt(paymentMode),
      balance: parseFloat(studentDetails.balance),
      discount: parseFloat(discountAmount),
      concessionAmount: parseFloat(studentDetails.concessionAmount),
      previousPaidAmount: 0,
    };

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/FeeDeposit/FeeDeposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        alert("Failed to deposit fee");
        setShowMoodal(false);
      } else {
        const data = await response.json();

        // Extracting paymentId from the response
        const paymentId = data.paymentId;
        // Call fetchData with the obtained paymentId
        handlePrintReceipt(paymentId);
        setShowMoodal(true);

        // Handle success response
        setLoadingBarProgress(100);
      }

      // Clear input fields on successful response
      document.getElementById("amount").value = "";
      document.getElementById("paidamount").value = "";
      document.getElementById("discountAmout").value = "";
      document.getElementById("Balance").value = "";
      document.getElementById("Concession").value = "";
      document.getElementById("advanceamount").value = "";
      document.getElementById("paymentMode").value = "Select";
    } catch (error) {
      // Handle error
      console.error("Error occurred while saving data:", error);
    }
  };

  const handlePrint = async (paymentId) => {
    try {
      await handlePrintReceipt(paymentId);
      setShowMoodal(true);
    } catch (error) {
      console.error("Error fetching print data:", error);
      // Handle error if needed
    }
  };

  const handlePrintReceipt = async (paymentId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/FeeDeposit/MonthFeeReciept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          paymentId: paymentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrintData(data); // Set the printData state with the fetched data
      } else {
        console.error("Failed to fetch interest level data");
      }
    } catch (error) {
      console.error("API request error:", error);
    } finally {
    }
  };

  const generatePDF = () => {
    if (!printData) return;

    const schoolName =
        sessionStorage.getItem("organizationName").replace(/['"]+/g, "") ||
        "JEEVAN ADARSH VIDYALAYA ";
    const schoolAddress =
        sessionStorage.getItem("address").replace(/['"]+/g, "") ||
        "STREET NO 1 2 B- BLOCK SARUP VIHAR, SOME OTHER INFO HERE";

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [300, 200],
    });

    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const padding = 5;
    const receiptWidth = (pageWidth / 2) - (padding * 2);

    const generateReceipt = (offsetX) => {
        let yPos = 15;
        const boxX = offsetX + padding;
        const boxY = padding;
        const boxWidth = receiptWidth;
        const boxHeight = pageHeight - padding * 2;

        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(boxX, boxY, boxWidth, boxHeight, "S");

        const logo = sessionStorage.getItem("clientLogo");
        const logoSrc = `https://arizshad-002-site5.ktempurl.com${logo.replace("~", "")}`;
        const logoWidth = 20;
        const logoHeight = 20;

        doc.setFontSize(18);
        doc.setTextColor(0);
        doc.addImage(logoSrc, "JPEG", boxX + 5, boxY + 5, logoWidth, logoHeight);
        doc.text(schoolName, boxX + boxWidth / 2, yPos + 5, { align: "center" });

        // Full school address dynamically wrapped
        doc.setFontSize(10);
        const addressLines = doc.splitTextToSize(schoolAddress, boxWidth - 10);
        addressLines.forEach((line, i) => {
            doc.text(line, boxX + boxWidth / 2, yPos + 12 + (i * 5), { align: "center" });
        });

        yPos += lineHeight * 2 + (addressLines.length * 5); // Adjusted for better spacing

        // Receipt Number - Reduced Top Margin
        // doc.setFontSize(11);
        // yPos += 1; 
        // doc.text(`Receipt No: ${printData.list[0].recieptNo}`, boxX + boxWidth - 10, yPos, {
        //     align: "right",
        // });

        yPos += lineHeight * 0.5;
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.line(boxX + 10, yPos, boxX + boxWidth - 10, yPos);

        // Receipt Details Table
        const receiptDetails = [
          ["Name:", printData.list[0].studentName, "Date:", printData.list[0].feePaymentDate],
          ["Class:", printData.list[0].class, "Admission No:", printData.list[0].admissionNo],
          ["Month:", printData.list[0].month || "N/A", "Receipt No:", printData.list[0].recieptNo],
      ];
      

        doc.autoTable({
            startY: yPos + 3,
            body: receiptDetails,
            columnStyles: { 0: { fontStyle: "bold" }, 2: { halign: "right", fontStyle: "bold" } },
            margin: { left: boxX + 5 },
            tableWidth: boxWidth - 10,
        });

        yPos = doc.autoTable.previous.finalY + 5; // Reduced margin before Fee Particulars

        // Fee Particulars Table
        const tableData = [["Fee Particulars", "Amount"]];
        printData.chargerList.forEach((charge) => {
            tableData.push([charge.chargeName, charge.chargeAmount.toString()]);
        });
        tableData.push(["Total:", printData.totalChargeAmount.toString()]);
        tableData.push(["Discount Amount:", printData.discountAmount?.toString() || "0"]);

        doc.autoTable({
          startY: yPos,
          head: [["Fee Particulars", { content: "Amount", styles: { halign: "right" } }]], // Right-align "Amount"
          body: tableData.slice(1),
          columnStyles: { 
              0: { fontStyle: "bold" }, 
              1: { halign: "right", cellPadding: { top: 2, right: 3 } } 
          },
          headStyles: { fillColor: [160, 160, 160] },
          margin: { left: boxX + 5 },
          tableWidth: boxWidth - 10,
      });
      
      
        yPos = doc.autoTable.previous.finalY + 5;

        // Payment Details Box
        const paymentBoxX = boxX + 3;
        const paymentBoxY = yPos;
        const paymentBoxWidth = boxWidth - 10;
        const paymentBoxHeight = 50;

        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(paymentBoxX, paymentBoxY, paymentBoxWidth, paymentBoxHeight);

        // Payment Details Table inside the box
        const paymentDetails = [
            ["Total Charge Amount:", printData.totalChargeAmount.toString()],
            ["Paid Amount:", printData.list[0].paidAmount.toString()],
            ["Previous Paid Amount:", printData.list[0].previousPaidAmount?.toString() || "0"],
            ["Fine Amount:", printData.list[0].fineAmount.toString()],
            ["Wallet Amount:", printData.list[0].walletAmount.toString()],
            ["Balance:", printData.list[0].balance.toString()],
        ];

        doc.autoTable({
            startY: paymentBoxY + 3, // Slight margin inside the box
            body: paymentDetails,
            columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right", fontStyle: "bold" } },
            margin: { left: boxX + 5 },
            tableWidth: paymentBoxWidth - 5,
        });
    };

    generateReceipt(0);
    generateReceipt(pageWidth / 2);

    const pdfBlob = doc.output("blob");
    const url = window.URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
    window.URL.revokeObjectURL(url);

    
      // Save the PDF
      // doc.save("fee_receipt.pdf");
};

  return (
    <Container>
      <div
        style={{
          marginTop: "50px",
          border: "0.3px solid #CC9966",
          height: "50px",
          background: "rgb(190 171 108 / 92%)",
          color: "white",
        }}
      >
        <div className="form-check form-check-inline m-3">
          <input
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio1"
            value="Partial Payment"
            onChange={handleCheckboxChange}
            checked={isPartialPayment}
          />
          <label className="form-check-label" htmlFor="inlineRadio1">
            <b>Partial Payment</b>
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio2"
            value="Annual Pack Payment"
            onChange={handleCheckboxChange}
            checked={!isPartialPayment}
          />
          <label className="form-check-label" htmlFor="inlineRadio2">
            <b>Annual Pack Payment</b>
          </label>
        </div>
      </div>

      <div className="container mt-3 card">
        <form style={{ marginTop: "10px" }}>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="admissionNo" className="form-label">
                Admission NO.
              </label>
              <div className="input-group">
                <input
                  style={{ backgroundColor: "#e3e3e3" }}
                  type="text"
                  className="form-control"
                  id="admissionNo"
                  placeholder="Admission NO."
                  value={studentDetails.admissionNo || formValues.admissionNo} // Populate admissionNo
                  readOnly // Make it read-only if needed
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                  onClick={fetchAdmission}
                >
                  🔍
                </button>
              </div>
            </div>
            <div className="col">
              <label htmlFor="receiptDate" className="form-label">
                Receipt Date
              </label>
              <input
                type="date"
                className="form-control"
                id="receiptDate"
                placeholder="Receipt Date"
                value={studentDetails.receiptDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="class" className="form-label">
                Class
              </label>
              <input
                style={{ backgroundColor: "#e3e3e3" }}
                type="text"
                className="form-control"
                id="class"
                placeholder="Class"
                value={studentDetails.className || formValues.className}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="field4" className="form-label">
                Student Name
              </label>
              <input
                style={{ backgroundColor: "#e3e3e3" }}
                type="text"
                className="form-control"
                id="field4"
                placeholder="Student Name"
                value={studentDetails.studentName || formValues.studentName}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="fatherName" className="form-label">
                Father Name
              </label>
              <input
                style={{ backgroundColor: "#e3e3e3" }}
                type="text"
                className="form-control"
                id="fatherName"
                placeholder="Father Name"
                value={studentDetails.fatherName || formValues.fatherName}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="section" className="form-label">
                Section
              </label>
              <input
                style={{ backgroundColor: "#e3e3e3" }}
                type="text"
                className="form-control"
                id="section"
                placeholder="Section"
                value={studentDetails.sectionName || formValues.sectionName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </div>
      <div class="container mt-3">
        <div class="row">
          <div class="col-6 " style={{ width: "37%" }}>
            <div class="card">
              <div class="card-body">
                <input
                  class="form-control"
                  type="text"
                  value={
                    chargeDetails.length === 0
                      ? "No record to show"
                      : "Charge Details"
                  }
                  aria-label="Disabled input example"
                  style={{ height: "50px", marginTop: "15px" }}
                  disabled
                  readOnly
                ></input>
                {chargeDetails.length !== 0 && (
                  <div className="mt-3">
                    <table className="table">
                      <thead
                        style={{ backgroundColor: "#1898c2eb", color: "white" }}
                      >
                        <tr>
                          <th>Serial No</th>
                          <th>Charge Name</th>
                          <th>Charge Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chargeDetails.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.chargeName}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={item.chargerAmount}
                                onChange={(e) =>
                                  handleAmountChange(index, e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                 <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Invalid Amount</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The entered amount cannot be less than the paid amount. Please check your input.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

                <div class="row">
                  <div class="col-md-10"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6" style={{ width: "63%" }}>
            <div class="card">
              <h5
                class="card-title"
                style={{
                  border: "0.1px solid #1898c2eb",
                  height: "30px",
                  width: "100%",
                  background: "#1898c2eb",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                Payment For Month
              </h5>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-10">
                    <div class="container" style={{ width: "42vw" }}>
                      <table
                        class="table table-bordered table-responsive"
                        style={{ fontSize: "12px", overflowX: "auto" }}
                      >
                        <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col">First Date</th>
                            <th scope="col">Month</th>
                            <th scope="col">Fee Amount </th>
                            <th scope="col"> Fine</th>
                            <th scope="col"> Paid Amount</th>
                            <th scope="col">Status</th>{" "}
                            {/* New Status column */}
                            <th scope="col"> Print </th>{" "}
                            {/* Replace Status with Print column */}
                          </tr>
                        </thead>
                        <tbody>
                          {monthFeeDetails.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                item.paidStaus === 1 ? "highlighted-row" : ""
                              }
                            >
                              <th scope="row">
                                <input
                                  className="form-check-input position-static"
                                  type="checkbox"
                                  id={`blankCheckbox${index}`}
                                  checked={item.isChecked || false}
                                  onChange={(e) =>
                                    handleCheckboxesChange(
                                      index,
                                      e.target.checked
                                    )
                                  }
                                  disabled={item.paidStaus === 1}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    border: "2px solid black",
                                    accentColor: "black",
                                    cursor:
                                      item.paidStaus === 1
                                        ? "not-allowed"
                                        : "pointer", // Show not-allowed cursor when disabled
                                  }}
                                />
                              </th>
                              <td>
                                <input
                                  type="date"
                                  className="form-control"
                                  id={`exampleInputEmail1${index}`}
                                  aria-describedby="enterDate"
                                  placeholder="Enter Date"
                                  value={formatDateForInput(item.date)} // Use a function to format the date for the input
                                  onChange={(e) =>
                                    handleDateChange(index, e.target.value)
                                  }
                                  style={{ width: "110px" }}
                                />
                              </td>
                              <td>{item.monthName}</td>
                              <td>{item.totalFee}</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  id={`input2${index}`}
                                  value={item.fine}
                                  style={{ width: "70px" }}
                                />
                              </td>
                              <td id="prevpaidAmnt">{item.paidAmount}</td>
                              <td>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color:
                                      item.paidStaus === 1 ? "green" : "red",
                                    fontSize: "13px",
                                  }}
                                >
                                  {item.paidStaus === 1 ? "Paid" : "Unpaid"}
                                </span>
                              </td>{" "}
                              {/* Display status with color */}
                              <td>
                                <button
                                  className="btn btn-primary"
                                  disabled={item.transactionId === 0}
                                  onClick={() =>
                                    handlePrint(item.transactionId)
                                  }
                                >
                                  Print
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPartialPayment ? (
        <div className="container card mt-2 py-3">
          <div class="container  card mt-2 py-3">
            <form>
              <div class="row mb-3">
                <div class="col-sm-4">
                  <label for="field1">Total Amount</label>
                  <input
                    type="text"
                    class="form-control"
                    id="amount"
                    placeholder="Amount"
                    value={totalAmount ?? formValues.totalAmount ?? ""}
                    onChange={handleTotalAmountChange}
                    readOnly
                  />
                </div>
                <div class="col-sm-4">
                  <label for="field2">Paid Amount</label>
                  <input
                    type="text"
                    class="form-control"
                    id="paidamount"
                    placeholder=" Paid Amount"
                    value={paidAmount || formValues.paidAmount}
                    onChange={handlePaidAmountChange}
                  />
                </div>
                 {/* Dialog for month selection error */}
      <Dialog open={showMonthDialog} onClose={handleCloseMonthDialog}>
        <DialogTitle>Validation Error</DialogTitle>
        <DialogContent>
          <DialogContentText>Please select at least one month for payment.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMonthDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for paid amount error */}
      <Dialog open={showPaidAmountDialog} onClose={handleClosePaidAmountDialog}>
        <DialogTitle>Validation Error</DialogTitle>
        <DialogContent>
          <DialogContentText>The paid amount cannot be zero. Please enter a valid amount.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaidAmountDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <div className="mb-3 col">
  <label htmlFor="paymentMode">Payment Mode</label>
  <select
    id="paymentMode"
    className="form-select"
    value={selectedPaymentMode} // Ensure this matches the selected mode
    onChange={handlePaymentModeChange} // Handle the selection
  >
    <option value="" disabled>
      Select
    </option>
    {bankData.map((item) => (
      <option key={item.bankId} value={item.bankId}>
        {item.bankName}
      </option>
    ))}
  </select>
</div>

              </div>
              <div class="row mb-3" style={{ marginTop: "-20px" }}>
                <div class="col">
                  <label for="field4">Discount Amount</label>
                  <input
                    type="text"
                    class="form-control"
                    id="discountAmout"
                    placeholder="Discount Amount"
                    value={discountAmount || formValues.discountAmount}
                    onChange={handleDiscountChange}
                  />
                </div>
                <div class="col">
                  <label for="field5">Balance</label>
                  <input
                    style={{ backgroundColor: "#e3e3e3" }}
                    type="text"
                    class="form-control"
                    id="Balance"
                    placeholder="Balance"
                    value={balance || formValues.balance}
                    readOnly
                  />
                </div>
                <div class="col">
                  <label for="field9">Inventory Balance</label>
                  <input
                    style={{ backgroundColor: "#e3e3e3" }}
                    type="text"
                    class="form-control"
                    id="inventoryBalance"
                    placeholder="Inventory Balance"
                    readOnly
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label for="field7">Concession</label>
                  <input
                    style={{ backgroundColor: "#e3e3e3" }}
                    type="text"
                    class="form-control"
                    id="Concession"
                    placeholder="Concession"
                    value={concessionAmount || formValues.concessionAmount}
                    // onChange={handleConcessionChange}
                    readOnly
                  />
                </div>
                <div class="col">
                  <label for="field8">Fine</label>
                  <input
                    style={{ backgroundColor: "#e3e3e3" }}
                    type="text"
                    class="form-control"
                    id="fine"
                    placeholder="fine"
                    value={totalFine}
                    readOnly
                  />
                </div>
                <div class="col">
                  {/* <label for="field9">Inventory Balance</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="inventoryBalance"
                                        placeholder="inventoryBalance"
                                    /> */}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label for="field7">Amount After Discount</label>
                  <input
                    style={{ backgroundColor: "#e3e3e3" }}
                    type="text"
                    class="form-control"
                    id="amntafterdiscount"
                    placeholder="Discounted Amount"
                    value={amountAfterDiscount}
                    readOnly
                  />
                </div>
                <div class="col">
                  <label for="field8">Wallet Amount</label>
                  <input
                    type="text"
                    class="form-control"
                    id="walletAmount"
                    placeholder="Wallet Amount"
                    value={walleteAmount}
                    // onChange={(e) => setWalleteAmount(e.target.value)}
                    style={{ backgroundColor: "#e3e3e3" }}
                  />
                </div>
                <div class="col"></div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label for="field7">Advance Amount</label>
                  <input
                    style={{ backgroundColor: "#e3e3e3" }}
                    type="text"
                    class="form-control"
                    id="advanceamount"
                    placeholder="Advance Amount"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    readOnly
                  />
                </div>
                <div class="col">
                  <label for="field8"></label>
                </div>
                <div class="col"></div>
              </div>
            </form>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                className="btn btn-success my-2"
                onClick={handleSave}
              >
                <b>SAVE</b>
              </button>
              <button
                type="button"
                className="btn btn-warning my-2 "
                style={{ marginLeft: "25px" }}
                onClick={() => window.location.reload()}
              >
                <b>RESET</b>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div class="container  card mt-2 py-3">
          <form>
            <div class="row mb-3">
              <div class="col-sm-4">
                <label for="field1">Total Amount</label>
                <input
                  type="text"
                  class="form-control"
                  id="amount"
                  placeholder="Amount"
                  value={studentDetails.totalFee}
                  onChange={handleTotalAmountChange}
                  readOnly
                />
              </div>
              <div class="col-sm-4">
                <label for="field2">Paid Amount</label>
                <input
                  type="text"
                  class="form-control"
                  id="paidamount"
                  placeholder=" Paid Amount"
                  value={paidAmount}
                  onChange={handlePaidAmountChange}
                />
              </div>
              <div class="mb-3 col">
                <label for="field6">Payment Mode</label>
                <select
                  id="paymentMode"
                  className="form-select"
                  value={selectedPaymentMode} // Set the value of the select
                  onChange={handlePaymentModeChange} // Handle manual changes
                >
                  <option selected>Select</option>
                  {bankData.map((item) => (
                    <option key={item.bankId} value={item.bankId}>
                      {item.bankName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div class="row mb-3" style={{ marginTop: "-20px" }}>
              <div class="col">
                <label for="field4">Discount Amount</label>
                <input
                  type="text"
                  class="form-control"
                  id="discountAmout"
                  placeholder="Discount Amount"
                  value={discountAmount}
                  onChange={handleDiscountChange}
                />
              </div>
              <div class="col">
                <label for="field5">Balance</label>
                <input
                  style={{ backgroundColor: "#e3e3e3" }}
                  type="text"
                  class="form-control"
                  id="Balance"
                  placeholder="Balance"
                  value={studentDetails.balance}
                  readOnly
                />
              </div>
              <div class="col">
                <label for="field9">Inventory Balance</label>
                <input
                  style={{ backgroundColor: "#e3e3e3" }}
                  type="text"
                  class="form-control"
                  id="inventoryBalance"
                  placeholder="Inventory Balance"
                  value={studentDetails.inveintoryBalance}
                  readOnly
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="field7">Concession</label>
                <input
                  style={{ backgroundColor: "#e3e3e3" }}
                  type="text"
                  class="form-control"
                  id="Concession"
                  placeholder="Concession"
                  value={studentDetails.concessionAmount}
                  // onChange={handleConcessionChange}
                  readOnly
                />
              </div>
              <div class="col">
                <label for="field8">Fine</label>
                <input
                  style={{ backgroundColor: "#e3e3e3" }}
                  type="text"
                  class="form-control"
                  id="fine"
                  placeholder="fine"
                  value={totalFine}
                  readOnly
                />
              </div>
              <div class="col">
                {/* <label for="field9">Inventory Balance</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="inventoryBalance"
                                    placeholder="inventoryBalance"
                                    value={studentDetails.inveintoryBalance}
                                /> */}
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="field7">Amount After Discount</label>
                <input
                  style={{ backgroundColor: "#e3e3e3" }}
                  type="text"
                  class="form-control"
                  id="amntafterdiscount"
                  placeholder="Discounted Amount"
                  value={amountAfterDiscount}
                  readOnly
                />
              </div>
              <div class="col">
                <label for="field8">Wallet Amount</label>
                <input
                  type="text"
                  class="form-control"
                  id="walletAmount"
                  placeholder="Wallet Amount"
                  value={studentDetails.walletAmount}
                  // onChange={(e) => setWalleteAmount(e.target.value)}
                  style={{ backgroundColor: "#e3e3e3" }}
                />
              </div>
              <div class="col"></div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="field7">Advance Amount</label>
                <input
                  type="text"
                  class="form-control"
                  id="advanceamount"
                  placeholder="Advance Amount"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                />
              </div>
              <div class="col">
                <label for="field8"></label>
              </div>
              <div class="col"></div>
            </div>
          </form>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              className="btn btn-success my-2"
              onClick={annualHandleSave}
            >
              <b>SAVE</b>
            </button>
            <button
              type="button"
              className="btn btn-warning my-2 "
              style={{ marginLeft: "25px" }}
              onClick={() => window.location.reload()}
            >
              <b>RESET</b>
            </button>
          </div>
        </div>
      )}
      {/* Modal to display admission data */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Admission Data</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          <div
            className="navbar mb-3"
            style={{ backgroundColor: "#1898c2eb", padding: "10px" }}
          >
            <div className="input-group" style={{ width: "45%" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm} // Bind search term state to input
                onChange={handleSearchChange}
              />
            </div>
            <div className="input-group" style={{ width: "45%" }}>
              <select
                className="form-select"
                value={selectedClass}
                onChange={handleClassChange}
              >
                <option value="">Select Class</option>
                {ddlClass.map((item) => (
                  <option key={item.classId} value={item.classId}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {noDataFound ? (
            <p style={{ textAlign: "center" }}>No data found</p>
          ) : (
            <table
              className="table"
              style={{ fontSize: "13px", fontWeight: "bold" }}
            >
              <thead>
                <tr>
                  <th>Admission No.</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Father's Name</th>
                  <th></th> {/* Add a column for the select button */}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.admissionNo}</td>
                    <td>{item.studentName}</td>
                    <td>{item.className}</td>
                    <td>{item.sectionName}</td>
                    <td>{item.fatherName}</td>
                    <td>
                      {/* Add the select button */}
                      <button
                        type="button"
                        className="btn btn-success my-2 btn-sm"
                        onClick={() => handleSelectButtonClick(item.studentId)}
                      >
                        <b>Select</b>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showMoodal} onHide={() => setShowMoodal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>
            Fee Deposit Successful
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your fee deposit was successful.</p>
          <p>Click the button below to generate the receipt.</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={generatePDF}>
            Generate PDF
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FeeDeposit;