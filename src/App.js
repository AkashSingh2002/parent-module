
import './App.css';
import Dashboard from './components/Dashboard';
import { useLocation } from 'react-router-dom';

import AccountForm from './components/AccountForm';
import Sidebar from './components/Sidebar';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import LogIn from './components/LogIn';
import State from './components/Master/State/State';
import Employee from './components/Master/Employee/Employee';
import AddEmployee from './components/Master/Employee/AddEmployee';
import EditEmployee from './components/Master/Employee/EditEmployee';
import Designation from './components/Master/Designation/Designation';
import Department from './components/Master/Department/Department';
import Concession from './components/Master/Concession/Concession';
import City from './components/Master/City/City';
import ChargeDetails from './components/Master/ChargeDetails/ChargeDetails';
import Organization from './components/Master/Organisation/Organization';
import Country from './components/Master/country/Country';
import AddOrganisation from './components/Master/Organisation/AddOrganisation';
import EditOrganization from './components/Master/Organisation/EditOrganization';
import AddCountry from './components/Master/country/AddCountry';
import AddPurpose from './components/Master/Purpose/AddPurpose';

// import FeeGenerationForm from './components/fee/FeeGeneration';
import AdmissionForm from './components/AdmForm';
import AddRegistration from './components/Admission/Registration/AddRegistration';
import Registration from './components/Admission/Registration/Registration';

import FeeGenerationForm from './components/Master/fee/FeeGeneration';
import AddState from './components/Master/State/AddState';
import Branch from './components/Master/Branch/Branch';
import ManageQuiz from './components/Master/Manage Quiz/ManageQuiz';

import UserGroup from './components/CPanel/UserGroup/UserGroup';
import EditCountry from './components/Master/country/EditCountry';
import LoadingBar from 'react-top-loading-bar';
import EditBranch from './components/Master/Branch/EditBranch';
import EditCity from './components/Master/City/EditCity';
import EditState from './components/Master/State/EditState';
import AddCity from './components/Master/City/AddCity';
import AddDesignation from './components/Master/Designation/AddDesignation';
import AddDepartment from './components/Master/Department/AddDepartment';
import EditDepartment from './components/Master/Department/EditDepartment';
import EditDesignation from './components/Master/Designation/EditDesignation';


import Protected from './components/Protected';

import Nationality from './components/Master/Nationality/Nationality';
import AddNationality from './components/Master/Nationality/AddNationality';
import EditNationality from './components/Master/Nationality/EditNationality';
import Source from './components/Master/Source/Source';
import CourseQuestion from './components/Master/CourseQuestion/CourseQuestion';
import InterestLevel from './components/Master/Interest Level/InterestLevel';
import DeliveryMode from './components/Master/Mode Of Delivery/DeliveryMode';

import AddInrstLvl from './components/Master/Interest Level/AddIntrstLvl';
import EditIntrstLvl from './components/Master/Interest Level/EditIntrstLvl';
import Form from './components/Master/AddForm/Form';
import AddForm from './components/Master/AddForm/AddForm';
import EditForm from './components/Master/AddForm/EditForm';

import AddSourceDetails from './components/Master/Source/AddSource';
import EditSourceDetails from './components/Master/Source/EditSource';
import AddDelivery from './components/Master/Mode Of Delivery/AddDeliveryMode';
import EditDelivery from './components/Master/Mode Of Delivery/EditDeliveryMode';
import Status from './components/Master/Status/Status';
import AddStatus from './components/Master/Status/AddStatus';
import EditStatus from './components/Master/Status/EditStatus';
import User from './components/CPanel/User/User';

import Course from './components/Course/Courses/Course';
import AddUserForm from './components/CPanel/User/AddUser';
import EditUserForm from './components/CPanel/User/EditUser';
import AddTopic from './components/Course/Topic/AddTopic';
import EditTopic from './components/Course/Topic/EditTopic';
import Module from './components/Course/Module/Module';
import AddCourse from './components/Course/Courses/AddCourse';
import EditModule from './components/Course/Module/EditModule';
import AddModule from './components/Course/Module/AddModule';
import Topic from './components/Course/Topic/Topic';



import AddUserGroup from './components/CPanel/UserGroup/AddUserGroup';
import EditUserGroup from './components/CPanel/UserGroup/EditUserGroup';
import AddUser from './components/CPanel/User/AddUser';
import EditUser from './components/CPanel/User/EditUser';
import EditCourse from './components/Course/Courses/EditCourse';
import AddBranch from './components/Master/Branch/AddBranch';
import Bank from './components/Master/Bank/Bank';
import ClassType from './components/Master/ClassType/ClassType';
import EditClassType from './components/Master/ClassType/EditClassType';
import AddClassType from './components/Master/ClassType/AddClassType';
import Religion from './components/Master/Religion/Religion';
import AddBank from './components/Master/Bank/AddBank';
import EditBank from './components/Master/Bank/EditBank';
import AddReligion from './components/Master/Religion/AddReligion';
import EditReligion from './components/Master/Religion/EditReligion';
import AddConcession from './components/Master/Concession/AddConcession';
import EditConcession from './components/Master/Concession/EditConcession';
import Occupation from './components/Master/Occupation/occupation';
import AddOccupation from './components/Master/Occupation/AddOccupation';
import EditOccupation from './components/Master/Occupation/EditOccupation';
import Section from './components/Master/Section/Section';
import SectionMaster from './components/Master/Section/Section';
import AddSection from './components/Master/Section/AddSection';
import ChargeMaster from './components/Master/Charge Master/ChargeMaster';
import AddCharge from './components/Master/Charge Master/AddChargeMaster';
import AddChargeMaster from './components/Master/Charge Master/AddChargeMaster';
import TopicMaster from './components/ClassMapping/Topic/TopicMaster';
import ClassMapping from './components/ClassMapping/ClassMapping';
import AddAdmission from './components/Admission/Admission/AddAdmission';
import Vehicle from './components/Master/Vehicle/Vehicle';
import AddVehicle from './components/Master/Vehicle/AddVehicle';
import DueDateDetails from './components/Master/Fine/Fine';
import AddFine from './components/Master/Fine/AddFine';
import Question from './components/Master/Question/Question';
import QuestionMaster from './components/Master/Question/AddQuestion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddManageQuiz from './components/Master/Manage Quiz/AddManageQuiz';
import Admission from './components/Admission/Admission/Admission';
import UpdateAdmission from './components/Admission/Admission/UpdateAdmission';
import EditFine from './components/Master/Fine/EditFine';
import SubCategory from './components/Inventory/Sub Category/SubCategory';
import SubCategoryUpdate from './components/Inventory/Sub Category/EditSubCategory';
import Enquiry from './components/Enquiry/Enquiry';
import EnquiryDetails from './components/Enquiry/EnquiryDetails';
import EnquiryPage from './components/Enquiry/Enquiry';
import UpdateEnquiry from './components/Enquiry/UpdateEnquiry';
import EnquiryFollow from './components/Enquiry/EnquiryFollow';
import UpdateRegistration from './components/Admission/Registration/UpdateRegistration';
import Class from './components/Admission/class/Class';
import AddClass from './components/Admission/class/AddClass';
import SettingQuiz from './components/Master/Manage Quiz/AddManageQuiz';
import EditQuiz from './components/Master/Manage Quiz/EditQuiz';
import Assignment from './components/Assignment/Assignment';
import AssignementUpdate from './components/Assignment/AssignmentUpdate';
import FeeGeneration from './components/Master/fee/FeeGeneration';
import EditQuestion from './components/Master/Question/EditQuestion';
import SubjectMaster from './components/Master/SubjectMaster/AddsubjectMaster';
import FeeDeposit from './components/Master/fee/FeeDeposit';
import EditSection from './components/Master/Section/EditSection';
import SubMaster from './components/Master/SubjectMaster/SubMaster';
import AddSubjectMaster from './components/Master/SubjectMaster/AddsubjectMaster';
import EditTopicMaster from './components/ClassMapping/Topic/EditTopic';
import AddLession from './components/ClassMapping/Lession/AddLession';
import UpdateLession from './components/ClassMapping/Lession/UpdateLession';
import LessonPage from './components/ClassMapping/Lession/LessonPage';
import TopicPage from './components/ClassMapping/Topic/TopicPage';
import AddExamCriteria from './components/Examination/ExaminationCriteria/AddExamCriteria';
import AddExamSubCategory from './components/Examination/SubCategory/AddExamSubCategory';
import UpdateExamSubCategory from './components/Examination/SubCategory/UpdateExamSubCategory';
import AddExam from './components/Examination/Exam/AddExam';
import Result from './components/Result/Result';
import DemoReport from './components/Report/Payment';
import Payment from './components/Report/Payment';
import AdmissionReport from './components/Report/AdmReport/AdmissionReport';
import AttendanceReport from './components/Report/AttendanceReport';
import ClassPromotion from './components/Admission/Class Promotion/ClassPromotion';
import ReceiptPrint from './components/ReceiptPrint';
import Vendor from './components/Inventory/Vendor Master/vendor';
import AddVendor from './components/Inventory/Vendor Master/AddVendor';
import EditVendor from './components/Inventory/Vendor Master/EditVendor';
import Attendance from './components/Attendance/Attendance';
import Brand from './components/Inventory/Brand/Brand';
import AddAttendance from './components/Attendance/AddAttendance';
import AssignmentCreate from './components/Assignment/AssignmentCreate';
import ClassTeacherMapping from './components/ClassMapping/ClassTeacherMapping';
import EditVehicle from './components/Master/Vehicle/EditVehicle';
import ChangePassword from './components/ChangePassword';
import EditClass from './components/Admission/class/EditClass';
import UpdateSubMaster from './components/Master/SubjectMaster/UpdateSubMaster';
import ScanRegistration from './components/Admission/Registration/ScanRegistration';
import StudentsSidebar from './components/StudentLogin/StudentsSidebar';

import StdDashboard from './components/StudentLogin/StdDashboard';
import AssignmentDetails from './components/StudentLogin/AssignmentDetails';
import AssignmentCard from './components/StudentLogin/AssignmentCard';
import AssignmentList from './components/StudentLogin/AssignmentList';
import CommingSoon from './components/StudentLogin/CommingSoon';
import EditChargeMaster from './components/Master/Charge Master/EditChargeMaster';
import AdmissionManual from './components/Admission/Admission/AdmissionManual';
import FeeDuesDetails from './components/Master/fee/FeeDuesDetails';
import LeavingCertificate from "./components/SLC's/LeavingCertificate";
import SLCManagement from './components/SLC\'s/SLCManagement';
import GeneratePDFButton from "./components/SLC's/Certificate";
import CreateTimeTab from './components/TimeTable/CreateTimeTab';
import GetTimeTab from './components/TimeTable/GetTimeTab';
import TemplateTable from './components/Settings/Message Template/TemplateTable';
import TemplateForm from './components/Settings/Message Template/TemplateForm';
import ApiTable from './components/Settings/WhatsApp API/ApiTable';
import AddApiForm from './components/Settings/WhatsApp API/AddApiForm';
import ApiForm from './components/Settings/WhatsApp API/ApiForm';
import EditTemplate from './components/Settings/Message Template/EditTemplate';
import Caste from './components/Master/Caste/Caste';
import EditCaste from './components/Master/Caste/EditCaste';
import AddCaste from './components/Master/Caste/AddCaste';
import AttendanceForm from './components/Attendance/EmployeeAttendance/AttendanceForm';
import EmployeeAttendance from './components/Attendance/EmployeeAttendance/EmployeeAttendance';
import PeriodTable from './components/TimeTable/PeriodSequence/PeriodTable';
import AddPeriod from './components/TimeTable/PeriodSequence/AddPeriod';
import SubjectsPage from './components/StudentLogin/SubjectsPage';
import { LssnPg } from './components/StudentLogin/LssnPg';
import { TopicsPage } from './components/StudentLogin/TopicsPage';
import TymTbl from './components/StudentLogin/TymTbl';
import AssignmentCreateForm from './components/Assignment/AssignmentCreateForm';



import UpdateExamCriteria from './components/Examination/ExaminationCriteria/UpdateExamCriteria';
import ResultGeneration from './components/Result/ResultGeneration';
import GeneratedResult from './components/Result/GeneratedResult';
import StudentUser from './components/CPanel/StudentUsers/StudentUser';
import CreateNewUser from './components/CPanel/StudentUsers/CreateNewUser';
import StreamPage from './components/Master/Stream/StreamPage';
import AdmitPage from './components/Examination/AdmitCard/AdmitPage';
import AdmitCard from './components/Examination/AdmitCard/AdmitCard';

// parent module imports
import Header from './components/Parents/components/Header';
import ParentSidebar from './components/Parents/components/Sidebar';
import ParentDashboard from './components/Parents/components/Dashboard';
import ParentAttendance from './components/Parents/pages/Attendance';
import ChatApp from './components/Parents/pages/ChatApp';
import AssignmentNotifications from './components/Parents/pages/Assignment';




function App() {
  const theme = createTheme({
    typography: {
      fontFamily: [
        "Enriqueta",
        'serif'
      ].join(','),
    }
  });


  // .enriqueta-medium {
  //   font-family: "Enriqueta", serif;
  //   font-weight: 500;
  //   font-style: normal;
  // }
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
            {/*  Parents Routes */}
            <Route path="/header" element={<Header />} />
            <Route path="/sidebar" element={<Sidebar />} />
            <Route path="/ParentDashboard" element={<ParentDashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/chatapp" element={<ChatApp />} />
            <Route path="/assignment" element={<AssignmentNotifications />} />
            </Routes>
        <ThemeProvider theme={theme}>
          <Routes>



            <Route
              path="/dashboard"
              element={<Sidebar content={<Dashboard />} />}
            />
            <Route path="/home" element={<Protected Component={Sidebar} />} />
            <Route path="/" element={<AccountForm />} />
            <Route path="/login" element={<LogIn />} />
            <Route
              path="/country/:encodedFormId"
              element={<Sidebar content={<Country />} />}
            />
            <Route
              path="/AddCountry"
              element={<Sidebar content={<AddCountry />} />}
            />
            <Route
              path="/purpose/:id"
              element={<Sidebar content={<AddPurpose />} />}
            />

            <Route
              path="/State/:encodedFormId"
              element={<Sidebar content={<State />} />}
            />
            <Route
              path="/editstate/:stateId"
              element={<Sidebar content={<EditState />} />}
            />
            <Route
              path="/EditCountry/:countryId"
              element={<Sidebar content={<EditCountry />} />}
            />
            <Route
              path="/addstate"
              element={<Sidebar content={<AddState />} />}
            />

            <Route
              path="/City/:encodedFormId"
              element={<Sidebar content={<City />} />}
            />
            <Route
              path="/addcity"
              element={<Sidebar content={<AddCity />} />}
            />
            {/* <Route path="/subjectmaster/:encodedFormId" element={<Sidebar content={<SubjectMaster/>}/>} /> */}
            <Route
              path="/editcity/:cityId"
              element={<Sidebar content={<EditCity />} />}
            />
            <Route
              path="/Organization/:encodedFormId"
              element={<Sidebar content={<Organization />} />}
            />
            <Route
              path="/Employee/:encodedFormId"
              element={<Sidebar content={<Employee />} />}
            />
            <Route
              path="/addemployee"
              element={<Sidebar content={<AddEmployee />} />}
            />
            <Route
              path="/editemployee/:employeeId"
              element={<Sidebar content={<EditEmployee />} />}
            />
            <Route
              path="/branch/:encodedFormId"
              element={<Sidebar content={<Branch />} />}
            />
            <Route
              path="/addbranch"
              element={<Sidebar content={<AddBranch />} />}
            />
            <Route
              path="/EditBranch"
              element={<Sidebar content={<EditBranch />} />}
            />
            <Route
              path="/addbranch"
              element={<Sidebar content={<AddBranch />} />}
            />
            <Route
              path="/ChargeDetails"
              element={<Sidebar content={<ChargeDetails />} />}
            />
            {/* <Route path="/followupmedium/:encodedFormId" element={<Sidebar content={<FollowUpDetails/>} />}/> */}
            <Route
              path="/nationality/:encodedFormId"
              element={<Sidebar content={<Nationality />} />}
            />
            <Route
              path="/addnationality"
              element={<Sidebar content={<AddNationality />} />}
            />
            <Route
              path="/editnationality/:nationalityId"
              element={<Sidebar content={<EditNationality />} />}
            />
            <Route
              path="/Designation/:encodedFormId"
              element={<Sidebar content={<Designation />} />}
            />
            <Route
              path="/adddesignation"
              element={<Sidebar content={<AddDesignation />} />}
            />
            <Route
              path="/editdesignation/:desigId"
              element={<Sidebar content={<EditDesignation />} />}
            />
            <Route
              path="/Department/:encodedFormId"
              element={<Sidebar content={<Department />} />}
            />
            <Route
              path="/adddepartment"
              element={<Sidebar content={<AddDepartment />} />}
            />
            <Route
              path="/editdepartment/:deptId"
              element={<Sidebar content={<EditDepartment />} />}
            />
            <Route
              path="/addsource"
              element={<Sidebar content={<AddSourceDetails />} />}
            />
            <Route
              path="/editsource/:enquirySourceId"
              element={<Sidebar content={<EditSourceDetails />} />}
            />
            <Route path="/source" element={<Sidebar content={<Source />} />} />
            <Route
              path="/Concession/:encodedFormId"
              element={<Sidebar content={<Concession />} />}
            />
            <Route
              path="/addconcession"
              element={<Sidebar content={<AddConcession />} />}
            />
            <Route
              path="/editconcession/:concessionId"
              element={<Sidebar content={<EditConcession />} />}
            />
            <Route
              path="/addtopic"
              element={<Sidebar content={<AddTopic />} />}
            />
            <Route
              path="/edittopic"
              element={<Sidebar content={<EditTopic />} />}
            />
            <Route
              path="/editOrganization/:organisationId"
              element={<Sidebar content={<EditOrganization />} />}
            />
            <Route
              path="/managequiz/:encodedFormId"
              element={<Sidebar content={<ManageQuiz />} />}
            />
            <Route
              path="/addmanagequiz"
              element={<Sidebar content={<AddManageQuiz />} />}
            />
            <Route
              path="/paymentmode/:encodedFormId"
              element={<Sidebar content={<Bank />} />}
            />
            <Route
              path="/addbank"
              element={<Sidebar content={<AddBank />} />}
            />
            <Route
              path="/editbank/:bankId"
              element={<Sidebar content={<EditBank />} />}
            />
            <Route
              path="/classtype/:encodedFormId"
              element={<Sidebar content={<ClassType />} />}
            />
            <Route
              path="/editclasstype/:classTypeId"
              element={<Sidebar content={<EditClassType />} />}
            />
            <Route
              path="/addclasstype"
              element={<Sidebar content={<AddClassType />} />}
            />
            <Route
              path="/religion/:encodedFormId"
              element={<Sidebar content={<Religion />} />}
            />
            <Route
              path="/addreligion"
              element={<Sidebar content={<AddReligion />} />}
            />
            <Route
              path="/editreligion/:religionID"
              element={<Sidebar content={<EditReligion />} />}
            />
            <Route
              path="/editsection/:sectionId"
              element={<Sidebar content={<EditSection />} />}
            />
            <Route
              path="/subjectmaster/:encodedFormId"
              element={<Sidebar content={<SubMaster />} />}
            />
            <Route
              path="/addsubjectmaster"
              element={<Sidebar content={<AddSubjectMaster />} />}
            />
            <Route
              path="/editsubmaster/:subjectID"
              element={<Sidebar content={<UpdateSubMaster />} />}
            />
            <Route
              path="/occupation/:encodedFormId"
              element={<Sidebar content={<Occupation />} />}
            />
            <Route
              path="/addoccupation"
              element={<Sidebar content={<AddOccupation />} />}
            />
            <Route
              path="/editoccupation/:occupationId"
              element={<Sidebar content={<EditOccupation />} />}
            />

            <Route
              path="/classcharge/:encodedFormId"
              element={<Sidebar content={<ChargeMaster />} />}
            />
            <Route
              path="/editclasscharge/:classId"
              element={<Sidebar content={<EditChargeMaster />} />}
            />
            <Route
              path="/addcharge"
              element={<Sidebar content={<AddChargeMaster />} />}
            />

            <Route
              path="/sectionmaster/:encodedFormId"
              element={<Sidebar content={<SectionMaster />} />}
            />
            <Route
              path="/addsection"
              element={<Sidebar content={<AddSection />} />}
            />

            {/* <Route path="/user" element={<Sidebar content={<User/>} />}/> */}
            <Route
              path="/adduser"
              element={<Sidebar content={<AddUser />} />}
            />
            {/* <Route path="/UserGroup/:encodedFormId" element={<Sidebar content={<UserGroup/>} />}/> */}
            <Route
              path="/edituser/:userId"
              element={<Sidebar content={<EditUser />} />}
            />
            <Route
              path="/user/:encodedFormId"
              element={<Sidebar content={<User />} />}
            />
            <Route path="/user" element={<Sidebar content={<User />} />} />
            <Route
              path="/adduser"
              element={<Sidebar content={<AddUser />} />}
            />
            <Route
              path="/UserGroup/:encodedFormId"
              element={<Sidebar content={<UserGroup />} />}
            />
            <Route
              path="/edituser/:userId"
              element={<Sidebar content={<EditUser />} />}
            />

            <Route
              path="/feeGeneration"
              element={<Sidebar content={<FeeGenerationForm />} />}
            />
            <Route
              path="/addOrganization"
              element={<Sidebar content={<AddOrganisation />} />}
            />
            {/* <Route path="/interestlevel/:encodedFormId" element={<Sidebar content={<InterestLevel/>} />}/>
            <Route path="/addintrstlvl" element={<Sidebar content={<AddInrstLvl/>} />}/>
            <Route path="/editIntestlvl/:lvlId" element={<Sidebar content={<EditIntrstLvl/>} />}/> */}
            <Route
              path="/modeofdelivery"
              element={<Sidebar content={<DeliveryMode />} />}
            />

            <Route
              path="/form/:encodedFormId"
              element={<Sidebar content={<Form />} />}
            />
            <Route
              path="/addform"
              element={<Sidebar content={<AddForm />} />}
            />
            <Route
              path="/editform/:formId"
              element={<Sidebar content={<EditForm />} />}
            />
            <Route
              path="/usergrp"
              element={<Sidebar content={<UserGroup />} />}
            />

            <Route
              path="/course/:encodedFormId"
              element={<Sidebar content={<Course />} />}
            />
            <Route
              path="/addcourse"
              element={<Sidebar content={<AddCourse />} />}
            />
            <Route
              path="/editcourse/:courseId"
              element={<Sidebar content={<EditCourse />} />}
            />
            <Route
              path="/module/:encodedFormId"
              element={<Sidebar content={<Module />} />}
            />
            <Route
              path="/addmodule"
              element={<Sidebar content={<AddModule />} />}
            />
            <Route
              path="/editmodule/:moduleId"
              element={<Sidebar content={<EditModule />} />}
            />
            {/* <Route path="/topic/:encodedFormId" element={<Sidebar content={<Topic/>} />}/> */}
            <Route
              path="/edittopic/:topicId"
              element={<Sidebar content={<EditTopic />} />}
            />
            <Route
              path="/addtopic"
              element={<Sidebar content={<AddTopic />} />}
            />
            <Route
              path="/vehicletype/:encodedFormId"
              element={<Sidebar content={<Vehicle />} />}
            />
            <Route
              path="/addvehicle"
              element={<Sidebar content={<AddVehicle />} />}
            />
            <Route
              path="/editvehicle/:vehicleTypeId"
              element={<Sidebar content={<EditVehicle />} />}
            />

            <Route
              path="/fine/:encodedFormId"
              element={<Sidebar content={<DueDateDetails />} />}
            />
            <Route
              path="/addfine"
              element={<Sidebar content={<AddFine />} />}
            />
            <Route
              path="/editfine/:fineId"
              element={<Sidebar content={<EditFine />} />}
            />
            <Route
              path="/vendormaster/:encodedFormId"
              element={<Sidebar content={<Vendor />} />}
            />
            <Route
              path="/addvendor"
              element={<Sidebar content={<AddVendor />} />}
            />
            <Route
              path="/editvendor/:vendorId"
              element={<Sidebar content={<EditVendor />} />}
            />
            <Route
              path="/addusergrp"
              element={<Sidebar content={<AddUserGroup />} />}
            />
            <Route
              path="/editusergrp/:userId"
              element={<Sidebar content={<EditUserGroup />} />}
            />

            <Route
              path="/question/:encodedFormId"
              element={<Sidebar content={<Question />} />}
            />
            <Route
              path="/addquestion"
              element={<Sidebar content={<QuestionMaster />} />}
            />
            <Route
              path="/editquestion/:questionId"
              element={<Sidebar content={<EditQuestion />} />}
            />

            <Route
              path="/adddeliverymode"
              element={<Sidebar content={<AddDelivery />} />}
            />
            <Route
              path="/editdeliverymode/:modeId"
              element={<Sidebar content={<EditDelivery />} />}
            />
            <Route
              path="/status/:encodedFormId"
              element={<Sidebar content={<Status />} />}
            />
            <Route
              path="/addstatus"
              element={<Sidebar content={<AddStatus />} />}
            />
            <Route
              path="/editstatus/:statusId"
              element={<Sidebar content={<EditStatus />} />}
            />
            <Route
              path="/classmapping/:encodedFormId"
              element={<Sidebar content={<ClassMapping />} />}
            />
            <Route
              path="/classteachermapping/:encodedFormId"
              element={<Sidebar content={<ClassTeacherMapping />} />}
            />
            <Route
              path="/topicmaster"
              element={<Sidebar content={<TopicMaster />} />}
            />
            <Route
              path="/topic/:encodedFormId"
              element={<Sidebar content={<TopicPage />} />}
            />
            <Route
              path="/edittopicmaster/:TopicId"
              element={<Sidebar content={<EditTopicMaster />} />}
            />
            <Route
              path="/addregistration"
              element={<Sidebar content={<AddRegistration />} />}
            />
            <Route
              path="/scanregistration"
              element={<Sidebar content={<ScanRegistration />} />}
            />
            <Route
              path="/addlession"
              element={<Sidebar content={<AddLession />} />}
            />
            <Route
              path="/lesson/:encodedFormId"
              element={<Sidebar content={<LessonPage />} />}
            />
            <Route
              path="/updatelesson/:LessionId"
              element={<Sidebar content={<UpdateLession />} />}
            />
            <Route
              path="/addadmission"
              element={<Sidebar content={<AddAdmission />} />}
            />
            <Route
              path="/admission/:encodedFormId"
              element={<Sidebar content={<Admission />} />}
            />
            <Route
              path="/updateadmission/:studentId"
              element={<Sidebar content={<UpdateAdmission />} />}
            />
            <Route
              path="/subcategory/:encodedFormId"
              element={<Sidebar content={<SubCategory />} />}
            />
            <Route
              path="/editsubcategory/:subcategoryId"
              element={<Sidebar content={<SubCategoryUpdate />} />}
            />
            <Route
              path="/addenquiry"
              element={<Sidebar content={<Enquiry />} />}
            />
            <Route
              path="/editenquiry/:enquiryId"
              element={<Sidebar content={<UpdateEnquiry />} />}
            />
            <Route
              path="/enquiry/:encodedFormId"
              element={<Sidebar content={<EnquiryDetails />} />}
            />
            <Route
              path="/followup/:encodedFormId"
              element={<Sidebar content={<EnquiryFollow />} />}
            />
            <Route
              path="/addregistration"
              element={<Sidebar content={<AddRegistration />} />}
            />
            <Route
              path="/registration/:encodedFormId"
              element={<Sidebar content={<Registration />} />}
            />
            <Route
              path="/updateregistration/:registrationId"
              element={<Sidebar content={<UpdateRegistration />} />}
            />
            <Route
              path="/class/:encodedFormId"
              element={<Sidebar content={<Class />} />}
            />
            <Route
              path="/addclass"
              element={<Sidebar content={<AddClass />} />}
            />
            <Route
              path="/editclass/:classId"
              element={<Sidebar content={<EditClass />} />}
            />
            <Route
              path="/managequiz/:encodedFormId"
              element={<Sidebar content={<ManageQuiz />} />}
            />
            <Route
              path="/addquiz"
              element={<Sidebar content={<SettingQuiz />} />}
            />
            <Route
              path="/editquiz/:quizId"
              element={<Sidebar content={<EditQuiz />} />}
            />
            <Route
              path="/assignmentcreate/:encodedFormId"
              element={<Sidebar content={<AssignmentCreate />} />}
            />
            <Route
              path="/assignmentcreateform"
              element={<Sidebar content={<AssignmentCreateForm />} />}
            />
            <Route
              path="/assignmentview/:encodedFormId"
              element={<Sidebar content={<Assignment />} />}
            />
            <Route
              path="/updateassignment/:id"
              element={<Sidebar content={<AssignementUpdate />} />}
            />
            <Route
              path="/feegeneration/:encodedFormId"
              element={<Sidebar content={<FeeGeneration />} />}
            />
            <Route
              path="/feedeposit/:encodedFormId"
              element={<Sidebar content={<FeeDeposit />} />}
            />
            <Route
              path="/dueslist/:encodedFormId"
              element={<Sidebar content={<FeeDuesDetails />} />}
            />
            <Route
              path="/examinationcriteria/:encodedFormId"
              element={<Sidebar content={<AddExamCriteria />} />}
            />
            <Route
              path="/updateexamcriteria/:examCriteriaId"
              element={<Sidebar content={<UpdateExamCriteria />} />}
            />
            <Route
              path="/examsubcategory/:encodedFormId"
              element={<Sidebar content={<AddExamSubCategory />} />}
            />
            <Route
              path="/updateexamsubcategory/:examId"
              element={<Sidebar content={<UpdateExamSubCategory />} />}
            />
            <Route
              path="/exam/:encodedFormId"
              element={<Sidebar content={<AddExam />} />}
            />
            <Route
              path="/result/:encodedFormId"
              element={<Sidebar content={<Result />} />}
            />
            <Route
              path="/paymentreport/:encodedFormId"
              element={<Sidebar content={<Payment />} />}
            />
            <Route
              path="/admissionreport/:encodedFormId"
              element={<Sidebar content={<AdmissionReport />} />}
            />
            <Route
              path="/attendancereport/:encodedFormId"
              element={<Sidebar content={<AttendanceReport />} />}
            />
            <Route
              path="/classpromotion/:encodedFormId"
              element={<Sidebar content={<ClassPromotion />} />}
            />
            <Route
              path="/receiptprint"
              element={<Sidebar content={<ReceiptPrint />} />}
            />
            <Route
              path="/attendance/:encodedFormId"
              element={<Sidebar content={<Attendance />} />}
            />
            <Route
              path="/brand/:encodedFormId"
              element={<Sidebar content={<Brand />} />}
            />
            <Route
              path="/addattendance"
              element={<Sidebar content={<AddAttendance />} />}
            />
            <Route
              path="/attendance"
              element={<Sidebar content={<Attendance />} />}
            />
            <Route
              path="/empattendance-form"
              element={<Sidebar content={<AttendanceForm />} />}
            />
            <Route
              path="/employeeattendance/:encodedFormId"
              element={<Sidebar content={<EmployeeAttendance />} />}
            />

            <Route
              path="/changepassword"
              element={<Sidebar content={<ChangePassword />} />}
            />
            <Route
              path="/messagetemplate/:encodedFormId"
              element={<Sidebar content={<TemplateTable />} />}
            />
            <Route
              path="/create-template/"
              element={<Sidebar content={<TemplateForm />} />}
            />
            <Route
              path="/edit-template/"
              element={<Sidebar content={<EditTemplate />} />}
            />
            <Route
              path="/whatsappApi/:encodedFormId"
              element={<Sidebar content={<ApiTable />} />}
            />
            <Route
              path="/add-api"
              element={<Sidebar content={<AddApiForm />} />}
            />
            <Route
              path="/viewapiform/:configId"
              element={<Sidebar content={<ApiForm />} />}
            />

            <Route
              path="/studentdashboard"
              element={<StudentsSidebar content={<StdDashboard />} />}
            />
            <Route
              path="/assignmentlist"
              element={<StudentsSidebar content={<AssignmentList />} />}
            />
            <Route
              path="/studentassignmentDetails"
              element={<StudentsSidebar content={<AssignmentDetails />} />}
            />
            <Route
              path="/comingsoon" // Define the path for the ComingSoon page
              element={<StudentsSidebar content={<CommingSoon />} />} // Nest it inside StudentsSidebar
            />
            <Route path="/abc" element={<GeneratePDFButton />} />
            <Route
              path="/leavingcertif"
              element={<Sidebar content={<LeavingCertificate />} />}
            />
            <Route
              path="/studenttc/:encodedFormId"
              element={<Sidebar content={<SLCManagement />} />}
            />
            <Route
              path="/addtimetable"
              element={<Sidebar content={<CreateTimeTab />} />}
            />
            <Route
              path="/timetable/:encodedFormId"
              element={<Sidebar content={<GetTimeTab />} />}
            />
            <Route
              path="/caste/:encodedFormId"
              element={<Sidebar content={<Caste />} />}
            />
            <Route
              path="/edit-caste/:casteId"
              element={<Sidebar content={<EditCaste />} />}
            />
            <Route
              path="/add-caste"
              element={<Sidebar content={<AddCaste />} />}
            />
            <Route
              path="/timeperiod/:encodedFormId"
              element={<Sidebar content={<PeriodTable />} />}
            />
            <Route
              path="/addperiodseq"
              element={<Sidebar content={<AddPeriod />} />}
            />
            <Route
              path="/subjects"
              element={<StudentsSidebar content={<SubjectsPage />} />}
            />
            <Route
              path="/lessons/:classId/:subjectId"
              element={<StudentsSidebar content={<LssnPg />} />}
            />
            <Route
              path="/topics/:classId/:subjectId/:lessonId"
              element={<StudentsSidebar content={<TopicsPage />} />}
            />
            <Route
              path="/time-table"
              element={<StudentsSidebar content={<TymTbl />} />}
            />
            <Route
              path="/resultgeneration/:encodedFormId"
              element={<Sidebar content={<ResultGeneration />} />}
            />
            <Route
              path="/getresult/:encodedFormId"
              element={<Sidebar content={<GeneratedResult />} />}
            />
            <Route
              path="/studentuser/:encodedFormId"
              element={<Sidebar content={<StudentUser />} />}
            />
            <Route
              path="/create-new-user"
              element={<Sidebar content={<CreateNewUser />} />}
            />
            <Route
              path="/changepassword"
              element={<Sidebar content={<ChangePassword />} />}
            />
            <Route
              path="/messagetemplate/:encodedFormId"
              element={<Sidebar content={<TemplateTable />} />}
            />
            <Route
              path="/create-template/"
              element={<Sidebar content={<TemplateForm />} />}
            />
            <Route
              path="/edit-template/"
              element={<Sidebar content={<EditTemplate />} />}
            />
            <Route
              path="/whatsappApi/:encodedFormId"
              element={<Sidebar content={<ApiTable />} />}
            />
            <Route
              path="/add-api"
              element={<Sidebar content={<AddApiForm />} />}
            />
            <Route
              path="/viewapiform/:configId"
              element={<Sidebar content={<ApiForm />} />}
            />

            <Route
              path="/studentdashboard"
              element={<StudentsSidebar content={<StdDashboard />} />}
            />
            <Route
              path="/assignmentlist"
              element={<StudentsSidebar content={<AssignmentList />} />}
            />
            <Route
              path="/studentassignmentDetails/:subjectId"
              element={<StudentsSidebar content={<AssignmentDetails />} />}
            />
            <Route path="/xyz" element={<GeneratePDFButton />} />
            <Route
              path="/leavingcertif"
              element={<Sidebar content={<LeavingCertificate />} />}
            />
            <Route
              path="/studenttc/:encodedFormId"
              element={<Sidebar content={<SLCManagement />} />}
            />
            <Route
              path="/addtimetable"
              element={<Sidebar content={<CreateTimeTab />} />}
            />
            <Route
              path="/timetable/:encodedFormId"
              element={<Sidebar content={<GetTimeTab />} />}
            />
            <Route
              path="/caste/:encodedFormId"
              element={<Sidebar content={<Caste />} />}
            />
            <Route
              path="/edit-caste/:casteId"
              element={<Sidebar content={<EditCaste />} />}
            />
            <Route
              path="/add-caste"
              element={<Sidebar content={<AddCaste />} />}
            />
            <Route
              path="/timeperiod/:encodedFormId"
              element={<Sidebar content={<PeriodTable />} />}
            />
            <Route
              path="/addperiodseq"
              element={<Sidebar content={<AddPeriod />} />}
            />
            <Route
              path="/subjects"
              element={<StudentsSidebar content={<SubjectsPage />} />}
            />
            <Route
              path="/lessons/:classId/:subjectId"
              element={<StudentsSidebar content={<LssnPg />} />}
            />
            <Route
              path="/topics/:classId/:subjectId/:lessonId"
              element={<StudentsSidebar content={<TopicsPage />} />}
            />
            <Route
              path="/time-table"
              element={<StudentsSidebar content={<TymTbl />} />}
            />
            <Route
              path="/resultgeneration/:encodedFormId"
              element={<Sidebar content={<ResultGeneration />} />}
            />
            <Route
              path="/getresult/:encodedFormId"
              element={<Sidebar content={<GeneratedResult />} />}
            />
            <Route
              path="/studentuser/:encodedFormId"
              element={<Sidebar content={<StudentUser />} />}
            />
            <Route
              path="/create-new-user"
              element={<Sidebar content={<CreateNewUser />} />}
            />
            <Route
              path="/stream/:encodedFormId"
              element={<Sidebar content={<StreamPage />} />}
            />
            <Route
              path="/admitpage/:encodedFormId"
              element={<Sidebar content={<AdmitPage />} />}
            />
            <Route
              path="/admitcard/:encodedFormId"
              element={<Sidebar content={<AdmitCard />} />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
      {/* <AddUserForm/> */}
      {/* <EditUserForm/> */}
    </div>
  );
}
const EditCountryWrapper = () => {
  const location = useLocation();
  const { countryId, countryName } = location.state || {};

  return <EditCountry countryId={countryId} countryName={countryName} />;
};
export default App;
