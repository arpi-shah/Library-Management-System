import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Grid } from '@mui/material';

const NavBar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6" component={Link} to="/" color="inherit" style={{ textDecoration: 'none' }}>
              Library Management
            </Typography>
          </Grid>
          <Grid item>
            <Button color="inherit" component={Link} to="/book-search" style={{ textDecoration: 'none' }}>
              Book Search
            </Button>
            <Button color="inherit" component={Link} to="/checkout-by-isbn" style={{ textDecoration: 'none' }}>
              Checkout by ISBN
            </Button>
            <Button color="inherit" component={Link} to="/checkin" style={{ textDecoration: 'none' }}>
              Check In
            </Button>
            <Button color="inherit" component={Link} to="/add-borrower" style={{ textDecoration: 'none' }}>
              Add Borrower
            </Button>
            <Button color="inherit" component={Link} to="/fines" style={{ textDecoration: 'none' }}>
              Fines
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
