// checkoutByISBN.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Grid } from '@mui/material';
import NavBar from './NavBar';
const CheckoutByISBN = () => {
  const [isbnInput, setIsbnInput] = useState('');
    const [borrowerIdInput, setBorrowerIdInput] = useState('');
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [checkoutError, setCheckoutError] = useState('');

  const confirmCheckout = async (borrowerId,isbn) => {
    try {
      // Generate dates
      const dateOut = new Date().toISOString().split('T')[0];
      console.log(dateOut);
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      const formattedDueDate = dueDate.toISOString().split('T')[0];
  
      // Prepare data for the POST request
      const checkoutData = {
        isbn: isbn,
        borrowerId: borrowerId,
        dateOut: dateOut,
        dueDate: formattedDueDate,
      };
      console.log(checkoutData)
      // Make the POST request to your backend API
      
    const response = await fetch('http://localhost:5000/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkoutData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setCheckoutMessage(data.message || 'Book checked out successfully!');
          setCheckoutError('');
          //setShowBorrowerIdDialog(false);
            setIsbnInput('');
            setBorrowerIdInput('');
          // Additional actions after successful checkout
        } else {
          setCheckoutError(data.message || 'Failed to checkout book.');
          setCheckoutMessage('');
        }
      } catch (error) {
        setCheckoutError('Error occurred during checkout');
        setCheckoutMessage('');
        console.error('Error occurred during checkout:', error);
      }
  };

  return (
    <div>
      <NavBar/>
    
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom align="center">
          Checkout by ISBN
        </Typography>
          </Grid>
          
      <Grid item>
        <TextField
          label="Enter ISBN"
          variant="outlined"
          //fullWidth
          value={isbnInput}
          onChange={(e) => setIsbnInput(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Enter Borrower ID"
          variant="outlined"
          
          value={borrowerIdInput}
          onChange={(e) => setBorrowerIdInput(e.target.value)}
        />
      </Grid>
      <Grid item >
      <Button variant="contained" color="primary" onClick={() => confirmCheckout(borrowerIdInput,isbnInput)} >
          Checkout
        </Button>
          </Grid>
          {checkoutMessage && (
        <Grid item xs={12} sx={{ p: 2 }}>
          <Typography variant="body1" color="primary" align="center">
            {checkoutMessage}
          </Typography>
        </Grid>
      )}

      {/* UI for error message */}
      {checkoutError && (
        <Grid item xs={12} sx={{ p: 2 }}>
          <Typography variant="body1" color="error" align="center">
            {checkoutError}
          </Typography>
        </Grid>
      )}
      </Grid>
    </div>
      
  );
};

export default CheckoutByISBN;
