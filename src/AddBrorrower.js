
import React, { useState } from 'react';
import { TextField, Button, Typography, Grid } from '@mui/material';
import NavBar from './NavBar';

const AddBrorrower = () => {
  const [ssnInput, setssnInput] = useState('');
    const [bnameInput, setbnameInput] = useState('');
    const [addressInput, setaddressInput] = useState('');
    const [phoneInput, setphoneInput] = useState('');
    const [bInsertMessage, setbInsertMessage] = useState('');
    const [bInsertError, setbInsertError] = useState('');

  const add_borrower = async (ssn,bname,address,phone) => {
    try {
      // Generate dates
      var card_id = "ID"+await Math.random().toString().substr(2, 6);
      console.log(card_id);
  
      // Prepare data for the POST request
      const borrowerData = {
        card_id:card_id,
        ssn: ssn,
        bname: bname,
        address: address,
        phone: phone,
      };
      console.log(borrowerData)
      // Make the POST request to your backend API
      
    const response = await fetch('http://localhost:5000/insertborrower', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(borrowerData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setbInsertMessage(data.message || 'Book checked out successfully!');
          setbInsertError('');
          //setShowBorrowerIdDialog(false);
            setssnInput('');
          setbnameInput('');
          setaddressInput('');
          setphoneInput('');
          // Additional actions after successful checkout
        } else {
          setbInsertError(data.message || 'Failed to checkout book.');
          setbInsertMessage('');
        }
      } catch (error) {
        setbInsertError('Error occurred during checkout');
        setbInsertMessage('');
        console.error('Error occurred during checkout:', error);
      }
  };

  return (
    <div>
      <NavBar/>
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom align="center">
          Add Borrower
        </Typography>
          </Grid>
          
      <Grid item>
        <TextField
          label="Enter SSN"
          variant="outlined"
          //fullWidth
          value={ssnInput}
          onChange={(e) => setssnInput(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Enter Full Name"
          variant="outlined"
          
          value={bnameInput}
          onChange={(e) => setbnameInput(e.target.value)}
        />
          </Grid>
          <Grid item>
        <TextField
          label="Enter Address"
          variant="outlined"
          //fullWidth
          value={addressInput}
          onChange={(e) => setaddressInput(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Enter Phone no."
          variant="outlined"
          
          value={phoneInput}
          onChange={(e) => setphoneInput(e.target.value)}
        />
      </Grid>
      <Grid item >
      <Button variant="contained" color="primary" onClick={() => add_borrower(ssnInput,bnameInput,addressInput,phoneInput)} >
          Add
        </Button>
          </Grid>
          {bInsertMessage && (
        <Grid item xs={12} sx={{ p: 2 }}>
          <Typography variant="body1" color="primary" align="center">
            {bInsertMessage}
          </Typography>
        </Grid>
      )}

      {/* UI for error message */}
      {bInsertError && (
        <Grid item xs={12} sx={{ p: 2 }}>
          <Typography variant="body1" color="error" align="center">
            {bInsertError}
          </Typography>
        </Grid>
      )}
      </Grid></div>
      
  );
};

export default AddBrorrower;
