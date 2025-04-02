import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, RadioGroup, Radio, FormControlLabel, Select, MenuItem, Button, TextField, Box, AppBar, Toolbar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { saveAs } from 'file-saver';
import GenerateFee from './GenerateFee';
import DepositFee from './DepositFee';

function Payment() {
    return (
        <div className='container'>
           <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                        <Toolbar>
                            <Typography variant="h6" component="div">
                                Payment
                            </Typography>
                        </Toolbar>
                    </AppBar>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography variant="h6">Fee Generate Report</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <GenerateFee/>
            </AccordionDetails>
        </Accordion>

        {/* Add another Accordion item for Fee Deposit */}
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography variant="h6">Fee Deposit</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {/* Call a different component inside this Accordion item */}
                <DepositFee/>
            </AccordionDetails>
        </Accordion>
    </div>
);
}


export default Payment;
