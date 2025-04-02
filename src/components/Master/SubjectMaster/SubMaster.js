import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, TableBody, TableCell, TableRow, TableHead, Paper, Table, TableContainer, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SubjectMaster = () => {
    const [subjectMaster, setSubjectMaster] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedsubmaster, setSelectedSubmaster] = useState(null);

    let navigate = useNavigate();

    const handleDelete = async (subjectID) => {
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/SubjectMaster/Id?Id=${subjectID}`;
            const token = sessionStorage.getItem('token');

            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (response.ok) {
                // Handle success, e.g., refresh the data
                setSubjectMaster(prevData => prevData.filter(item => item.subjectID !== subjectID));
            } else {
                console.error('Delete failed');
                alert('Failed to delete subject master');
            }
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const fetchSubjectMaster = async () => {
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/SubjectMaster/GetSubject`;
            const token = sessionStorage.getItem('token');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching subject master data: ${response.status}`);
            }

            const subjectMasterData = await response.json();

            if (subjectMasterData.data === null && subjectMasterData.msg === "Record Not Found") {
                console.error('Record Not Found');
                alert('Record Not Found');
                return; // Exit the function if the record is not found
            }

            setSubjectMaster(subjectMasterData);
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    
    useEffect(() => {
        fetchSubjectMaster();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setSelectedSubmaster(null);
    };

    const handleClick = () => {
        navigate('/addsubjectmaster');
    };

    // Filter subjectMaster based on searchTerm
    const filteredSubjectMaster = subjectMaster.filter(submaster =>
        submaster.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <h3>Submaster</h3>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Button variant="contained" color="primary" style={{ marginLeft: '10px' }} onClick={handleClick}>
                    ADD
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>subject Name</TableCell>
                            <TableCell>shortName</TableCell>
                            <TableCell>subjectType</TableCell>
                            <TableCell>gradeSystem</TableCell>
                            <TableCell>priority</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubjectMaster.map((submaster) => (
                            <TableRow key={submaster.subjectID}>
                                <TableCell>{submaster.subjectName}</TableCell>
                                <TableCell>{submaster.shortName}</TableCell>
                                <TableCell>{submaster.subjectType}</TableCell>
                                <TableCell>{submaster.gradeSystem}</TableCell>
                                <TableCell>{submaster.priority}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => navigate(`/editsubmaster/${submaster.subjectID}`)}
                                    >
                                        EDIT
                                    </Button>
                                    <Button
                                        className='mx-2'
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            setShowModal(true);
                                            setSelectedSubmaster(submaster);
                                        }}
                                    >
                                        DELETE
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Modal */}
            <Modal open={showModal} onClose={handleClose} aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
                    <h2 id="delete-modal-title">Delete Confirmation</h2>
                    <p id="delete-modal-description">
                        Are you sure you want to delete <strong>{selectedsubmaster?.subjectName}</strong>?
                    </p>
                    <Button variant="contained" onClick={handleClose} style={{ marginLeft: '10px' }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(selectedsubmaster.subjectID)}>
                        Yes, Delete
                    </Button>
                </div>
            </Modal>
        </Container>
    );
};

export default SubjectMaster;
