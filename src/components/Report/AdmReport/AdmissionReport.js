import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, AppBar, Toolbar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RegistrationReport from './RegistrationReport';
import AdmReport from './AdmReport';

function AdmissionReport() {
  return (
    <div className='container'>
         <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                        <Toolbar>
                            <Typography variant="h6" component="div">
                                Admission Report
                            </Typography>
                        </Toolbar>
                    </AppBar>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Registration Report</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <RegistrationReport/>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography>Admission Report</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
           <AdmReport/>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default AdmissionReport;
