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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from '@mui/material';
  import NavBar from './NavBar';

const BookSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showBorrowerIdDialog, setShowBorrowerIdDialog] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedBorrower, setSelectedBorrower] = useState(null);
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [checkoutError, setCheckoutError] = useState('');

    const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/search', {
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
    
  const handleCheckout = async (isbn) =>  {
    setSelectedBook(isbn);
      setShowBorrowerIdDialog(true);
      
  };

  

  const confirmCheckout = async (borrowerId,isbn) => {
    try {
      // Generate dates
      const dateOut = new Date().toISOString().split('T')[0];
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
          setShowBorrowerIdDialog(false);
          setSelectedBook(null);
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
    <NavBar />
      <Grid container justifyContent="center" alignItems="center">
        
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom align="center">
          Book Search
        </Typography>
        
      </Grid>

      
        <TextField
          label="Search for ISBN, title, or author"
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
          Search Results
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ISBN</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Authors</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((result) => (
                <TableRow key={result.isbn}>
                  <TableCell>{result.isbn}</TableCell>
                  <TableCell>{result.title}</TableCell>
                  <TableCell>{result.authors}</TableCell>
                      <TableCell>
                    {result.Availability==='Checked Out' ? 'Checked Out' : 'Available'}
                  </TableCell>
                  <TableCell>
                    {result.Availability==='Checked Out' ? (
                      <Button disabled variant="contained">
                        Not Available
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleCheckout(result.isbn)}
                      >
                        Checkout
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          </Grid>
          
          <Dialog open={showBorrowerIdDialog} onClose={() => setShowBorrowerIdDialog(false)}>
        <DialogTitle>Enter Borrower ID</DialogTitle>
        <DialogContent>
          <TextField
            label="Borrower ID"
            variant="outlined"
            fullWidth
            autoFocus
            onChange={(e) => setSelectedBorrower(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBorrowerIdDialog(false)}>Cancel</Button>
          <Button onClick={() => confirmCheckout(selectedBorrower,selectedBook)} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      </Grid>
      </div>
  );
};
export default BookSearch;