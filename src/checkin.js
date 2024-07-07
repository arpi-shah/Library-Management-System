import React, { useState } from 'react';
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Grid,
   
  } from '@mui/material';
  import NavBar from './NavBar';

const CheckinBook = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
    const [CheckinMessage, setCheckinMessage] = useState('');
    const [CheckinError, setCheckinError] = useState('');

    const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchText }),
      });

        const data = await response.json();
        console.log(data);
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
    

  

  const confirmCheckin = async (loan_id) => {
    try {
      // Generate dates
      const dateIn = new Date().toISOString().split('T')[0];
  
      // Prepare data for the POST request
      const CheckinData = {
          loan_id: loan_id,
          date_in: dateIn
      };
      console.log(CheckinData)
      // Make the POST request to your backend API
      
    const response = await fetch('http://localhost:5000/confirmcheckin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(CheckinData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setCheckinMessage(data.message || 'Book checked out successfully!');
          setCheckinError('');
          //setShowBorrowerIdDialog(false);
          //setselectedLoan(null);
          // Additional actions after successful Checkin
        } else {
          setCheckinError(data.message || 'Failed to Checkin book.');
          setCheckinMessage('');
        }
      } catch (error) {
        setCheckinError('Error occurred during Checkin');
        setCheckinMessage('');
        console.error('Error occurred during Checkin:', error);
      }
  };

  return (
    <div>
    <NavBar />
      <Grid container justifyContent="center" alignItems="center">
       
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom align="center">
          Check In Book
        </Typography>
      </Grid>

      
        <TextField
          label="Search for ISBN, Borrower, or loan ID"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: '50%' }}
        />
      

      
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          fullWidth
          sx={{
            p: 2,
            fontSize: '0.8rem',
            width: '10%',
            marginLeft:'10px',
          }}
        >
          Search
        </Button>
      
      {CheckinMessage && (
        <Grid item xs={12} sx={{ p: 2 }}>
          <Typography variant="body1" color="primary" align="center">
            {CheckinMessage}
          </Typography>
        </Grid>
      )}

      {/* UI for error message */}
      {CheckinError && (
        <Grid item xs={12} sx={{ p: 2 }}>
          <Typography variant="body1" color="error" align="center">
            {CheckinError}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Search Results
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan ID</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Card ID</TableCell>
                <TableCell>Borrower</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((result) => (
                <TableRow key={result.loan_id}>
                  <TableCell>{result.loan_id}</TableCell>
                  <TableCell>{result.isbn}</TableCell>
                  <TableCell>{result.Title}</TableCell>
                  <TableCell>{result.card_id}</TableCell>
                  <TableCell>{result.bname}</TableCell>
                    
                  <TableCell>
                    
             
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => confirmCheckin(result.loan_id)}
                      >
                        Checkin
                        
                      </Button>
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </Grid>
          
          
    </Grid></div>
  );
};
export default CheckinBook;