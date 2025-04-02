import React, { useState, useEffect } from 'react';
import { LineChart, Line } from 'recharts';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const Dashboard = () => {
  const [admissionData, setAdmissionData] = useState([]);
  const [dashData, setDashData] = useState({});
  const [duesData, setDuesData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(""); // State for selected class
  const [viewFrequency, setViewFrequency] = useState("monthly"); // State for selected view frequency
  const [ddlClass, setDdlClass] = useState([]);
  const [amountData, setAmountData] = useState({});
  const [collectionData, setCollectionData] = useState([]);
  const [collectionViewFrequency, setCollectionViewFrequency] = useState("daily");
  const [schoolData, setSchoolData] = useState([]);


  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };



  const fetchSchoolData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;

      const response = await fetch(`${apiUrl}/FeeReport/GetSchoolName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {

        const data = await response.json();
         // Assuming data is an array and we need the first object
      const schoolData = data[0];
      
      // Save school name, address, and phone number to session storage
      sessionStorage.setItem('schoolName', JSON.stringify(schoolData.schoolName));
      sessionStorage.setItem('address', JSON.stringify(schoolData.address));
      sessionStorage.setItem('phoneNo', JSON.stringify(schoolData.phoneNo));
      
      setSchoolData(schoolData);

      } else {

        console.error('Failed to fetch state data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };


  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;

      const response = await fetch(`${apiUrl}/DashboardTotalNumbers/DashboardTotalNumbers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {

        const data = await response.json();
        if (data.status === null && data.msg === "Record Not Found") {
          
          return; // Exit the function if the record is not found
      }
        setDashData(data.objData);

      } else {

        console.error('Failed to fetch state data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const fetchMonthDues = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;

      const response = await fetch(`${apiUrl}/Dashboard/MonthDuesList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
    }
      setDuesData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFrequencyChange = (e) => {
    setViewFrequency(e.target.value);
    fetchData(e.target.value);
  };

  const fetchAttendanceData = async (timeFrame, classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      let endpoint = "";

      switch (timeFrame) {
        case "daily":
          endpoint = "/DashboardTotalNumbers/AttendanceRecord_Currentday";
          break;
        case "weekly":
          endpoint = "/DashboardTotalNumbers/AttendanceRecord_CurrentWeek";
          break;
        case "monthly":
          endpoint = "/DashboardTotalNumbers/AttendanceRecord_CurrentMonth";
          break;
        default:
          endpoint = "/DashboardTotalNumbers/AttendanceRecord_CurrentMonth";
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          classId: classId || 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Attendance data:', data); // Log fetched data for debugging
        setAttendanceData(data.data);
        const totalPresent = data.totalPresent;
        const totalAbsent = data.totalAbsent;
        setPieChartData([
          { name: 'Total Present', value: totalPresent },
          { name: 'Total Absent', value: totalAbsent }
        ]);
      } else {
        console.error('Failed to fetch attendance data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData(viewFrequency, selectedClass);
  }, [viewFrequency, selectedClass]);

  const handleAmountFrequencyChange = (e) => {
    setCollectionViewFrequency(e.target.value);
    fetchData(e.target.value);
  };

  const fetchAmountData = async (timeFrame) => {
    setCollectionViewFrequency(timeFrame);
    let apiUrl;
    
    switch (timeFrame) {
        case "monthly":
            apiUrl = `${process.env.REACT_APP_BASE_URL}/DashboardTotalNumbers/Amountcollection_CurrentMonth`;
            break;
        case "weekly":
            apiUrl = `${process.env.REACT_APP_BASE_URL}/DashboardTotalNumbers/Amountcollection_CurrentWeek`;
            break;
        case "daily":
            apiUrl = `${process.env.REACT_APP_BASE_URL}/DashboardTotalNumbers/Amountcollection_CurrentYear`;
            break;
        default:
            // Set default API URL
            apiUrl = `${process.env.REACT_APP_BASE_URL}/DashboardTotalNumbers/Amountcollection_CurrentYear`;
            break;
    }
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: sessionStorage.getItem('token'),
            },
            body: JSON.stringify({}),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === null && data.msg === "Record Not Found") {
              alert('Record Not Found');
              return; // Exit the function if the record is not found
          }
            setCollectionData(data.data);
        } else {
            console.error('Failed to fetch collection data');
        }
    } catch (error) {
        console.error('API request error:', error);
    }
};


  useEffect(() => {
    fetchAmountData(collectionViewFrequency);
  }, [collectionViewFrequency]);



  const fetchClass = async () => {
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
      if (data.data === null && data.msg === "Record Not Found") {
        
        return; // Exit the function if the record is not found
    }
      setDdlClass(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCollection = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;

      const response = await fetch(`${apiUrl}/DashboardTotalNumbers/Amountcollection_CurrentYear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === null && data.msg === "Record Not Found") {
        alert('Record Not Found');
        return; // Exit the function if the record is not found
    }
      setCollectionData(data.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchData();
    fetchMonthDues();
    generatePieChartData();
    fetchClass();
    fetchCollection();
    fetchSchoolData();
  }, [])

  const generatePieChartData = () => {
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
    const randomData = Array.from({ length: 5 }, (_, index) => ({
      name: `Category ${index + 1}`,
      value: Math.floor(Math.random() * 1000) + 100,
    }));
    setPieChartData(randomData.map((entry, index) => ({ ...entry, fill: colors[index % colors.length] })));
  };

  return (
    <>

      <div className='enriqueta-medium mt-3 mx-4' >
        <h3 class="page-title slide-from-top mb-4"><span class="page-title-icon bg-gradient-primary text-white mr-2"><i class="bi bi-house"></i></span> Dashboard </h3>

        <div className="row gx-2">
          <div className="col-md-3 slide-from-top">
            <div className="card custom-gradient-danger card-img-holder text-white" style={{ width: '18rem', filter: 'drop-shadow(5px 5px 5px grey)' }}>
              <img src={require("../../src/assets/circle.png")} className="card-img-absolute" alt="circle" />
              <div className="card-body">
                <h4 className="font-weight-normal mb-3">Login <i className="mdi mdi-chart-line mdi-24px float-right"></i></h4>
                <h2 className="mb-3">Total {dashData.totalLogin} </h2>
                <h6 className="card-text">Today {dashData.todayLogin} </h6>
                <h6 className="card-text">weekly {dashData.weeklyLogin} </h6>
                <h6 className="card-text">monthly {dashData.monthlyLogin} </h6>
              </div>
            </div>
          </div>

          <div className="col-md-3 slide-from-top">
            <div className="card custom-gradient-success card-img-holder text-white" style={{ width: '18rem', filter: 'drop-shadow(5px 5px 5px grey)' }}>
              <img src={require("../../src/assets/circle.png")} className="card-img-absolute" alt="circle" />
              <div className="card-body">
                <h4 className="font-weight-normal mb-3">Admissions <i className="mdi mdi-bookmark-outline mdi-24px float-right"></i></h4>
                <h2 className="mb-3">Total {dashData.totalAdmission} </h2>
                <h6 className="card-text">Today {dashData.totalTodayAdmission} </h6>
                <h6 className="card-text">weekly {dashData.totalWeeklyAdmission} </h6>
                <h6 className="card-text">monthly {dashData.totalMonthlyAdmission} </h6>
              </div>
            </div>
          </div>

          <div className="col-md-3 slide-from-top">
            <div className="card custom-gradient-info card-img-holder text-white" style={{ width: '18rem', filter: 'drop-shadow(5px 5px 5px grey)' }}>
              <img src={require("../../src/assets/circle.png")} className="card-img-absolute" alt="circle" />
              <div className="card-body">
                <h4 className="font-weight-normal mb-3">Follow Ups<i className="mdi mdi-diamond mdi-24px float-right"></i></h4>
                <h2 className="mb-3">Total  </h2>
                <h6 className="card-text">Today {dashData.todaysFollowUp} </h6>
                <h6 className="card-text">Missed {dashData.missedFollowUp} </h6>
                <h6 className="card-text">monthly  </h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 slide-from-top">
            <div className="card custom-gradient-high card-img-holder text-white" style={{ width: '18rem', filter: 'drop-shadow(5px 5px 5px grey)' }}>
              <img src={require("../../src/assets/circle.png")} className="card-img-absolute" alt="circle" />
              <div className="card-body">
                <h4 className="font-weight-normal mb-3">Due<i className="mdi mdi-diamond mdi-24px float-right"></i></h4>
                <h2 className="mb-3">Total {dashData.totalDue} </h2>
                <h6 className="card-text">Today {dashData.totalTodayDue} </h6>
                <h6 className="card-text">weekly {dashData.totalWeeklyDue} </h6>
                <h6 className="card-text">monthly {dashData.totalMonthlyDue} </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 ">
          <div className="card" style={{ filter: 'drop-shadow(5px 5px 5px grey)' }}>
            <div className="card-body my-8">
              <h4 className="page-title slide-from-top mx-4 mb-2">
                <span className="page-title-icon bg-gradient-primary text-white mr-2">
                  <i className="bi bi-bar-chart-fill"></i>
                </span> Attendance
              </h4>

              {/* Dropdown for Class */}
              <div className="mt-6">
                <div >
                  <div className="card-body my-8 d-flex justify-content-between align-items-center">
                    {/* Class Dropdown */}
                    <div className="form-group" style={{ width: '250px', marginRight: '20px' }}>

                      <select
                        id="classDropdown"
                        className="form-control"
                        value={selectedClass}
                        onChange={handleClassChange}
                        style={{ width: '226px', borderColor: '#047edf' }}
                      >
                        <option value="">Select Class</option>
                        {ddlClass.map((item) => (
                          <option key={item.classId} value={item.classId}>
                            {item.className}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Radio buttons for View Frequency */}
                    <div className="form-group d-flex flex-row">
                      <label style={{ marginRight: '10px' }}>View Frequency:</label>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="monthly"
                          value="monthly"
                          checked={viewFrequency === "monthly"}
                          onChange={handleFrequencyChange}
                          className="form-check-input" style={{ backgroundColor: '#047edf' }}
                        />
                        <label htmlFor="monthly" className="form-check-label">Monthly</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="weekly"
                          value="weekly"
                          checked={viewFrequency === "weekly"}
                          onChange={handleFrequencyChange}
                          className="form-check-input" style={{ backgroundColor: '#047edf' }}
                        />
                        <label htmlFor="weekly" className="form-check-label">Weekly</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          id="daily"
                          value="daily"
                          checked={viewFrequency === "daily"}
                          onChange={handleFrequencyChange}
                          className="form-check-input" style={{ backgroundColor: '#047edf' }}
                        />
                        <label htmlFor="daily" className="form-check-label">Daily</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={attendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="presentStudentsCount"
                    fill="url(#presentGradient)" // Set the fill to the gradient ID
                  />
                  <Bar
                    dataKey="absentStudentsCount"
                    fill="url(#absentGradient)" // Set the fill to the gradient ID
                  />
                  {/* Define linear gradient */}
                  <defs>
                    <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047edf" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#90caf9" stopOpacity={0.9} />
                    </linearGradient>
                    <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fe7096" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ffbf96" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="row " style={{ marginTop: '80px' }}>
          <div className="card" style={{ filter: 'drop-shadow(5px 5px 5px grey)' }}>
            <div className="card-body my-8">
              <div className="row">
                <h4 class="page-title slide-from-top mx-4 mb-3"><span class="page-title-icon bg-gradient-primary text-white mr-2 "><i class="bi bi-table"></i></span>  Dues List </h4>
                <div className="col-md-6 slide-from-top" style={{ maxHeight: '400px', overflowY: 'auto' }}>

                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="thead" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                        <tr style={{ background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}>
                          <th  >Serial No.</th>
                          <th >Admission No.</th>
                          <th >Studenty Name</th>
                          <th >Mobile No.</th>
                          <th >Payment Date</th>
                          <th >Paid Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Populate table rows dynamically */}
                        {duesData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.admissionNo}</td>
                            <td>{item.studentName}</td>
                            <td>{item.mobileNo}</td>
                            <td>{item.paymentDate}</td>
                            <td>{item.paidAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-6 slide-from-top">

                  <div style={{ textAlign: 'center' }}> {/* Centering the PieChart */}
                    <h3 class="page-title slide-from-top mx-4 mb-2"><span class="page-title-icon bg-gradient-primary text-white mr-2 "><i class="bi bi-pie-chart-fill"></i></span>  Total Attendance </h3>

                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          label
                        >
                          <Cell fill="#047edf" /> {/* Changed Cell fill color */}
                          <Cell fill="#ffbf96" /> {/* Changed Cell fill color */}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-6" style={{ marginTop: '60px' }}>
          <div className="card" style={{ filter: 'drop-shadow(5px 5px 5px grey)' }}>
            <div className="card-body my-8">
              <div className="row">
                <div className="col-md-12 slide-from-top">
                  <h4 class="page-title slide-from-top mx-4 mb-3">
                    <span class="page-title-icon bg-gradient-primary text-white mr-2 ">
                      <i class="bi bi-graph-up-arrow"></i>
                    </span>
                    Amount Collection
                  </h4>
                  <div className="form-group d-flex flex-row justify-content-end mr-4"> {/* Adjusted margin to move radio buttons to the right */}
                    <label style={{ marginRight: '10px' }}>View Frequency:</label>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        id="monthly"
                        value="monthly"
                        checked={collectionViewFrequency === "monthly"}
                        onChange={handleAmountFrequencyChange}
                        className="form-check-input" style={{ backgroundColor: '#047edf' }}
                      />
                      <label htmlFor="monthly" className="form-check-label">Monthly</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        id="weekly"
                        value="weekly"
                        checked={collectionViewFrequency === "weekly"}
                        onChange={handleAmountFrequencyChange}
                        className="form-check-input" style={{ backgroundColor: '#047edf' }}
                      />
                      <label htmlFor="weekly" className="form-check-label">Weekly</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        id="daily"
                        value="daily"
                        checked={collectionViewFrequency === "daily"}
                        onChange={handleAmountFrequencyChange}
                        className="form-check-input" style={{ backgroundColor: '#047edf' }}
                      />
                      <label htmlFor="daily" className="form-check-label">Yearly</label>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={collectionData} // Use the fetched collection data
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="collectedAmount" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    </>
  );
};

export default Dashboard;
