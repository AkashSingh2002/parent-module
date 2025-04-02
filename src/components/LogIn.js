import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [schoolData, setSchoolData] = useState([]);

  const fetchSchoolDetails = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/FeeReport/GetSchoolName`, {
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
      setSchoolData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSchoolDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handlelogIn = async (e) => {

    e.preventDefault(); // Prevent the default form submission behavior

    try {

      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/UserLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem('token1')


        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password,
        }),
      });

      if (response.ok) {
        // Login successful, navigate to the dashboard page or perform any other necessary actions
        const responseData = await response.json();
        const { token } = responseData;
        const { lastLoginOn } = responseData;
        const { day } = responseData;
        sessionStorage.setItem('login', true);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('lastLoginOn', lastLoginOn);
        sessionStorage.setItem('leftday', day);


        if (typeof responseData.objOutput === 'object' && responseData.objOutput !== null) {
          // Save objOutput and token to session storage
          sessionStorage.setItem('objOutput', JSON.stringify(responseData.objOutput));
          sessionStorage.setItem('userId', JSON.stringify(responseData.objOutput.userId))
          sessionStorage.setItem('classId', JSON.stringify(responseData.objOutput.classId))
          sessionStorage.setItem('sectionId', JSON.stringify(responseData.objOutput.sectionId))
          sessionStorage.setItem('employeeId', JSON.stringify(responseData.objOutput.employeeId))
          sessionStorage.setItem('userGroupId', JSON.stringify(responseData.objOutput.userGrpId))
          sessionStorage.setItem('userType', JSON.stringify(responseData.objOutput.userType))
          sessionStorage.setItem('organizationName', JSON.stringify(responseData.objOutput.organizationName))
          sessionStorage.setItem('logo', JSON.stringify(responseData.objOutput.logo))
          sessionStorage.setItem('clientImage', JSON.stringify(responseData.objOutput.imageUrl))
          sessionStorage.setItem('clientName', JSON.stringify(responseData.objOutput.employeeName))
          sessionStorage.setItem('expirydate', JSON.stringify(responseData.objOutput.expiryDate))
        } else {
          console.error('Invalid objOutput:', responseData.objOutput);
        }


         // Determine the redirect URL based on userType
         let redirectUrl = "/dashboard"; // Default to employee dashboard
         if (responseData.objOutput.userType === "Student") {
           redirectUrl = "/studentdashboard";
         } else if (responseData.objOutput.userType === "Employee" && responseData.objOutput.userGrpId === 5) {
           redirectUrl = "/teachersdashboard";
         } else if (responseData.objOutput.userType === "Parent" && responseData.objOutput.userGrpId === 7) {
          redirectUrl = "/ParentDashboard";
        }
 
         // Redirect the user
         navigate(redirectUrl);
      } else {
        // Handle login failure here (e.g., show an error message)
        console.error("Login failed");
        alert('Invalid credentials');
      }
    } catch (error) {
      // Handle API request error here
      console.error("API request error:", error);
      alert('An error occurred. Please try again later.');
    }
  };

  const logo = sessionStorage.getItem('clientLogo');
  const name = sessionStorage.getItem('clientCode');

  return (
    <div className="home">
      <main className="login-body" data-vide-bg="assets/img/login-bg.mp4">
        <form className="form-default" onSubmit={handlelogIn}>
            <div className="login-form">

              <div className="logo-login">
              <img src={`https://arizshad-002-site5.ktempurl.com${logo.replace('~', '')}`} alt="Logo" />
              </div>
              <h2>Login : {name}</h2>
              <div className="form-input">
                <label htmlFor="name">User Name</label>
                <input
                  type="text"
                  name="userId"  // Make sure the name attribute is set to "userId"
                  placeholder="Username"
                  onChange={handleInputChange}
                  value={formData.userId}
                />
              </div>
              <div className="form-input">
                <label htmlFor="name">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  value={formData.password}
                />
              </div>
              <div className="form-input pt-30">
                <input type="submit" name="submit" value="Login" />
              </div>

            </div>
        </form>
      </main>
    </div>
  );
};

export default LogIn