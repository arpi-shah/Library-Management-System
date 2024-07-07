// Fines.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Typography } from '@mui/material';

import NavBar from './NavBar';
const Fines = () => {
    const [finesData, setFinesData] = useState([]);
    
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [checkoutError, setCheckoutError] = useState('');
  
    useEffect(() => {
      fetchFinesData();
    }, []);
   
    const handleConfirmPayment = async (cardId) => {
        try {
          const response = await fetch(`http://localhost:5000/confirmpay/${cardId}`, {
            method: 'PUT',
          });
    
          if (response.ok) {
              console.log('Fines paid successfully');
              setCheckoutMessage(response.message || 'Fines paid successfully');
          setCheckoutError('');
            // Optionally, you might want to fetch fines data again after payment confirmation
            await fetchFinesData();
          } else {
              console.error('Failed to confirm payment');
              setCheckoutError(response.message || 'Failed to confirm payment');
          setCheckoutMessage('');
          }
        } catch (error) {
            setCheckoutError('Error occurred while confirming payment');
            setCheckoutMessage('');
          console.error('Error occurred while confirming payment:', error);
        }
      };
    
    const fetchFinesData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/fines?showPaid=${0}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setFinesData(data);
                console.log(finesData);
            } else {
                console.error('Failed to fetch fines');
            }
        } catch (error) {
            console.error('Error occurred while fetching fines:', error);
        }
    };

  
    const updateFines = async () => {
        try {
            const response = await fetch('http://localhost:5000/updatefines', {
                method: 'PUT',
            });
    
            if (response.ok) {
                console.log('Fines updated successfully');
                setCheckoutMessage(response.message || 'Fines updated successfully');
                setCheckoutError('');
            } else {
                console.error('Failed to update fines');
                setCheckoutError(response.message || 'Failed to update fines');
                setCheckoutMessage('');
            }
        } catch (error) {
            setCheckoutError('Error occurred while updating fines');
            setCheckoutMessage('');
            console.error('Error occurred while updating fines:', error);
        }
    };


  

 

  return (
    <div>
      <NavBar/>
      <Grid item xs={12} sx={{ textAlign: 'center', marginTop:'10px'}}>
      <Button variant="contained" color="secondary"
         onClick={() => updateFines()}>
          Update Fines
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

      <Grid item xs={12} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Fines
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Card_ID</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finesData.map((result) => (
                <TableRow key={result.card_id}>
                  <TableCell>{result.card_id}</TableCell>
                  <TableCell>{result.total_fine}</TableCell>
                  <TableCell>
                     
                  {result.card_id===null ? (
                      ''
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleConfirmPayment(result.card_id)}
                      >
                        PAY
                      </Button>
                    )}
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </Grid>
    </div>
  );
};

export default Fines;
