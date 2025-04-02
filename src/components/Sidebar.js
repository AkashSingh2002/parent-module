import React, { useState, useEffect, useRef } from 'react';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import base64 from 'base64-js';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Typography from '@mui/material/Typography';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ListItemButton, Menu, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

//import { Menu, MenuItem } from '@mui/material'; // Import necessary components from Material-UI


const Sidebar = ({ content }) => {
    const [open, setOpen] = useState(window.innerWidth >= 768); // Set initial state based on screen width
    const [user, setUser] = useState({
        name: 'Krish',
        designation: 'Software Engineer',
    });



    const [MasterOpen, setMasterOpen] = useState(false);
    const [FrontDeskOpen, setFrontDeskOpen] = useState(false);
    const [RegistrationOpen, setRegistrationOpen] = useState(false);
    const [AdmissionOpen, setAdmissionOpen] = useState(false);
    const [FeeOpen, setFeeOpen] = useState(false);
    const [AssignmentOpen, setAssignmentOpen] = useState(false);
    const [AttendanceOpen, setAttendanceOpen] = useState(false);
    const [InventoryOpen, setInventoryOpen] = useState(false);
    const [ExaminationOpen, setExaminationOpen] = useState(false);
    const [PaymentOpen, setPaymentOpen] = useState(false);
    const [ReportOpen, setReportOpen] = useState(false);
    const [CPanelOpen, setCPanelOpen] = useState(false);
    const [BranchOpen, setBranchOpen] = useState(false);
    const [drawerWidth, setDrawerWidth] = useState(window.innerWidth >= 768 ? 240 : 0);

    const [CourseOpen, setCourseOpen] = useState(false);
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false); // New state variable
    const [selectedDate, setSelectedDate] = useState(null); // New state variable
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [accountModalOpen, setAccountModalOpen] = useState(false);

    const handleAccountModalOpen = () => {
        setAccountModalOpen(true);
    };

    const handleAccountModalClose = () => {
        setAccountModalOpen(false);
    };


    // Function to toggle profile dropdown visibility
    let navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);
    // Function to handle search term change
    const handleSearchTermChange = async (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        try {
            // Fetch suggestions based on the search term
            const fetchedSuggestions = await fetchSuggestionsFromBackend(value);

            // Update suggestions state
            setSuggestions(fetchedSuggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            // Handle error state here, such as showing an error message to the user
        }
    };
    // Function to fetch suggestions (Replace this with your actual logic)
    // const fetchSuggestionsFromBackend = (value) => {
    //     // Simulated logic to return suggestions based on the search term
    //     // This can be an API call or fetching from local storage
    //     // For demonstration, returning some static suggestions
    //     return ['Form 1', 'Form 2', 'Form 3', 'Form 4'].filter((suggestion) =>
    //         suggestion.toLowerCase().includes(value.toLowerCase())
    //     );
    // };

    // const fetchSuggestionsFromBackend = async (value) => {
    //     try {
    //         const apiUrl = 'https://arizshad-002-site5.atempurl.com/api/ExclusivePermission/GetSearchForm';
    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 searchTerm: value
    //             })
    //         });

    //         if (response.ok) {
    //             const responseData = await response.json();
    //             return responseData.map(item => item.formName);
    //         } else {
    //             console.error('Failed to fetch suggestions');
    //             return [];
    //         }
    //     } catch (error) {
    //         console.error('Error fetching suggestions:', error);
    //         return [];
    //     }
    // };

    const fetchSuggestionsFromBackend = async (value) => {
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/ExclusivePermission/GetSearchForm`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),

                },
                body: JSON.stringify({
                    searchTerm: value
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                // Extract formName from each object in the response
                const suggestions = responseData.map(item => item.formName);
                // Filter suggestions based on the search term
                return suggestions.filter(suggestion =>
                    suggestion.toLowerCase().includes(value.toLowerCase())
                );
            } else {
                console.error('Failed to fetch suggestions');
                return [];
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return [];
        }
    };



    const handleSuggestionClick = (suggestion, encodedFormId) => {
        setSearchTerm(suggestion);
        setSuggestions([]); // Close suggestion dropdown after selection

        // Navigate to the selected suggestion route with the encoded form ID
        navigate(`/${suggestion.toLowerCase().replace(/\s+/g, '')}/${encodedFormId}`);
    };

    const handleOutsideClick = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            // Clicked outside the search area
            setSuggestions([]);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const handlePasswordChange = () => {
        // Handle password change logic here
       navigate('/changepassword');
    };



    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };


    const OrgName = sessionStorage.getItem('organizationName').replace(/['"]+/g, '');
    const emojiHi = '\u{1F44B}';



    const handleToggleDrawer = () => {
        setOpen(!open);
    };

    const handleCloseDrawer = () => {
        if (open && window.innerWidth < 768) {
            setOpen(false);
        }
    };

    // Add event listener for window resize to toggle drawer based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setDrawerWidth(240);
                setOpen(true);
            } else {
                setDrawerWidth(0);
                setOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [open]);


    const moduleIcons = {
        Master: <LayersIcon />,
        Salon: <LayersIcon />,
        Course: <AssessmentIcon />,
        'C-Panel': <LayersIcon />,
        eLearning: <LayersIcon />,
        Enquiry: <LayersIcon />,
        Inventory: <LayersIcon />,
        Admission: <AssignmentIcon />,
        Payment: <PaymentIcon />,
        Attendance: <MenuBookIcon />,
        Exclusive_Permission: <LayersIcon />,
        Online_Quiz: <LayersIcon />,
        Assignment: <AssignmentIcon />,
        Live_Online_Classes: <LayersIcon />,
        Certificate: <LayersIcon />,
        SMS: <LayersIcon />,
        Email: <LayersIcon />,
        Councellor: <LayersIcon />,
        Payroll: <LayersIcon />,
        Expense: <LayersIcon />,
        Reimbursment: <LayersIcon />,
        Accounting_Master: <LayersIcon />,
        Accounts_Other: <LayersIcon />,
        'MIS-Report': <LayersIcon />,
        Purchase: <LayersIcon />,
        // Add more icons for additional module names
    };


    const fetchModule = async () => {
    
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
    
            const response = await fetch(`${apiUrl}/ExclusivePermission/Module`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    // connectionString: sessionStorage.getItem('ConnectionString'),
                }),
            });
    
            if (response.status === 401) {
                alert('Session expired, please relogin.');
                navigate('/'); // Redirect to login page
                return; // Exit the function
            }
    
            if (!response.ok) {
                throw new Error(`Error fetching financial years: ${response.status}`);
            }
    
            const responseData = await response.json();
            if (responseData.data === null && responseData.msg === "Record Not Found") {
                return; // Exit the function if the record is not found
            }
    
            setData(responseData);
    
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    useEffect(() => {
        fetchModule();
    }, []);


    const fetchForm = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;

            const response = await fetch(`${apiUrl}/ExclusivePermission/Module`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    // connectionString: sessionStorage.getItem('ConnectionString'),

                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setFormData(responseData);
            } else {
                console.error('Account name incorrect');
                alert('Invalid account name');
            }
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };


    const [moduleOpenState, setModuleOpenState] = useState({});
    const encodeFormId = (formId) => {
        const bytes = new TextEncoder().encode(formId);
        return base64.fromByteArray(bytes);
    };

    const decodeFormId = (encodedFormId) => {
        const bytes = base64.toByteArray(encodedFormId);
        return new TextDecoder().decode(bytes);
    };

    const DropdownMenu = ({ moduleId, items }) => {
        return (
            <Collapse in={moduleOpenState[moduleId]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items.map((item) => (
                        <ListItemButton
                            key={item.formId}
                            component={Link}
                            to={`/${item.formName.toLowerCase().replace(/\s+/g, '')}/${encodeFormId(item.formId)}`}
                            sx={{ pl: 4, color: 'yellow' }} // Set your desired color here
                        >
                            <ListItemIcon style={{ color: 'yellow' }}> {/* Set your desired icon color here */}
                                <LayersIcon />
                            </ListItemIcon>
                            <ListItemText primary={item.formName} />
                        </ListItemButton>
                    ))}
                </List>
            </Collapse>
        );
    };

    const handleModuleItemClick = async (moduleId) => {
        // Close all other module dropdowns
        const updatedModuleOpenState = {};
        Object.keys(moduleOpenState).forEach((key) => {
            updatedModuleOpenState[key] = false;
        });

        // Fetch data for the clicked module
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(`${apiUrl}/ExclusivePermission/Form_Authorizer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    moduleId,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setFormData(responseData);
                // Update state variable for the clicked module and close other modules
                setModuleOpenState({
                    ...updatedModuleOpenState,
                    [moduleId]: !moduleOpenState[moduleId],
                });
            } else {
                console.error('Error fetching dropdown data for', moduleId);
                alert('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    const logo = sessionStorage.getItem('clientLogo');
    const lastlogin = sessionStorage.getItem('lastLoginOn');
    const day = sessionStorage.getItem('leftday');
    const expirydate = sessionStorage.getItem('expirydate');
    const clientImage = sessionStorage.getItem('clientImage');
    const clientName = sessionStorage.getItem('clientName');




    return (
        <>
            <div style={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backgroundColor: 'white',
                        color: 'purple',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setOpen(!open)}
                            sx={{ color: 'grey', display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <b className='enriqueta-medium' style={{
                            background: 'linear-gradient(90deg, rgb(152 106 182), rgb(68 28 127))',
                            WebkitBackgroundClip: 'text',
                            fontSize: '24px', // Set the font size to 24 pixels
                            fontWeight: 'bolder',
                            display: 'inline-block',
                            color: 'transparent', // Set the color to transparent
                        }}>
                            Welcome Back <span style={{ color: 'yellow' }}>{emojiHi}</span>
                        </b>


                        {/* Search bar */}
                        <div style={{ position: 'relative', marginLeft: 'auto' }} ref={inputRef}>
                            <TextField
                                id="search-for-forms"
                                placeholder="Search for forms"
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                InputProps={{
                                    startAdornment: (
                                        <IconButton edge="start" color="inherit" aria-label="search" sx={{ color: 'grey' }}>
                                            <SearchIcon />
                                        </IconButton>
                                    ),
                                    sx: {
                                        borderRadius: '20px',
                                        backgroundColor: '#f0f0f0',
                                        '& .MuiIconButton-root': {
                                            padding: '8px',
                                        },
                                        '& input': {
                                            height: '30px',
                                            padding: '5px',
                                        },
                                    },
                                }}
                            />
                            {suggestions.length > 0 && (
                                <div style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, width: '100%', backgroundColor: '#fff', borderRadius: '4px', zIndex: 999 }}>
                                    {suggestions.map((suggestion, index) => (
                                        <div style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, width: '100%', backgroundColor: '#fff', borderRadius: '8px', zIndex: 999, maxHeight: '300px', overflowY: 'auto' }}>
                                            {suggestions.map((suggestion, index) => (
                                                <div key={index} style={{ padding: '8px', borderBottom: '1px solid #ccc', cursor: 'pointer' }} onClick={() => handleSuggestionClick(suggestion, encodeFormId(suggestion))}>
                                                    {suggestion}
                                                </div>
                                            ))}
                                        </div>

                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bell icon */}
                        <IconButton
                            color="inherit"
                        >
                            <NotificationsIcon />
                        </IconButton>

                        {/* Profile icon with user's name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IconButton color="inherit" onClick={handleMenuOpen}>
                                <Avatar alt={OrgName} src={`https://arizshad-002-site5.ktempurl.com${logo.replace('~', '')}`} />
                            </IconButton>
                            <Typography className='enriqueta-medium' variant="subtitle1" color="inherit" onClick={handleMenuOpen}  style={{ cursor: 'pointer' }}> 
                                {clientName.replace(/['"]+/g, '')}
                            </Typography>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleAccountModalOpen}>Account</MenuItem>
                                <MenuItem onClick={handlePasswordChange}>Change Password</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                <MenuItem style={{
                                    background: 'linear-gradient(90deg, #8491d9, #1e07cd)',
                                    color: 'white',
                                }}>Last Login: {lastlogin}</MenuItem>

                            </Menu>
                        </div>
                        
                    </Toolbar>
                </AppBar>


                  {/* Account modal */}
                  <Dialog open={accountModalOpen} onClose={handleAccountModalClose}  
                   PaperProps={{
                    sx: {
                        height: '450px',
                        width: '400px', // Set your desired width here
                        maxWidth: 'calc(100% - 40px)', // Ensure the modal stays within the viewport
                        marginLeft: 'auto', // Center the modal horizontally
                        marginRight: 'auto', // Center the modal horizontally
                    },
                }}
                  >
    <DialogTitle style={{ backgroundColor: '#3f51b5', color: 'white' }}>Account</DialogTitle>
    <DialogContent style={{ padding: '20px', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ position: 'relative', marginBottom: '20px', marginTop: '40px' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(90deg,#ffbf96,#fe7096)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '300px' }}>
            {day}
        </div>
    </div>
        <Typography variant="body1" style={{ marginTop: '30px', textAlign: 'center', fontWeight: 'bold', marginBottom: '30px' }}>Days Left</Typography>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', width: '100%' }}>
        <Typography variant="body1" style={{ fontWeight: 'bold' }}>Subscription:</Typography>
        <Typography variant="body2" style={{ color: 'green' }}>Active</Typography>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', width: '100%' }}>
        <Typography variant="body1" style={{ fontWeight: 'bold' }}>Expires On:</Typography>
        <Typography variant="body2">{expirydate}</Typography>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography variant="body1" style={{ fontWeight: 'bold' }}>Contact Us:</Typography>
        <Typography variant="body2">xyz@gmail.com</Typography>
    </div>
</DialogContent>


    <DialogActions style={{ padding: '10px', borderTop: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
        <Button onClick={handleAccountModalClose} variant="contained" style={{ backgroundColor: '#3f51b5', color: 'white' }}>Close</Button>
    </DialogActions>
</Dialog>

                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={open}
                    sx={{
                        width: drawerWidth, // Use the dynamically set drawer width
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 250,
                            zIndex: (theme) => theme.zIndex.drawer,
                            backgroundColor: '#0B1F3D', // Add your background color here
                            color: 'white', // Add your text color here
                        },
                    }}
                    // Add transition component
                    transitionDuration={{ enter: 500, exit: 500 }} // Adjust duration as needed
                    TransitionComponent={Slide}
                    // Set direction to 'right' for the drawer to slide from the right
                    direction="right"
                >
                    <Toolbar />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', paddingLeft: '10px', paddingBottom: '15px' }}>
                        <Avatar alt={user.name} src={`https://arizshad-002-site5.ktempurl.com${logo.replace('~', '')}`} />
                        <div>
                            <Typography variant="h6" component="div" color="white" >
                                {OrgName}
                            </Typography>
                            {/* <Typography variant="body2" color="white">
                                {OrgName}
                            </Typography> */}
                        </div>
                    </div>


                    <List>
                        <ListItemButton component={Link} to="/dashboard">
                            <ListItemIcon className="white-icon-color" style={{ color: 'white' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>

                        {data.map((module) => (
                            <div key={module.moduleId}>
                                <ListItemButton onClick={() => handleModuleItemClick(module.moduleId)}>
                                    <ListItemIcon style={{ color: 'white' }}>
                                        {moduleIcons[module.moduleName] || <LayersIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={module.moduleName} />
                                    {module.moduleName in moduleOpenState && moduleOpenState[module.moduleName]
                                        ? <ExpandLessIcon />
                                        : <ExpandMoreIcon />
                                    }
                                </ListItemButton>
                                <DropdownMenu moduleId={module.moduleId} items={formData} />
                            </div>
                        ))}
                    </List>
                </Drawer>

                <div
                    onClick={handleCloseDrawer}
                    style={{
                        flexGrow: 1,
                        padding: '20px',
                    }}
                >
                    <Toolbar />
                    <main>
                        {content}
                    </main>
                </div>
            </div>
        </>
    );
};

export default Sidebar;