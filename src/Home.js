import React from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';

const features = [
  { id: 1, title: 'Book Search', description: 'Search for books', link: '/book-search' },
  { id: 2, title: 'Checkout by ISBN', description: 'Checkout a book by ISBN', link: '/checkout-by-isbn' },
  { id: 3, title: 'Check In', description: 'Check in book ', link: '/checkin' },
  { id: 4, title: 'Add Borrower', description: 'Add Borrowers to the database', link: '/add-borrower' },
  { id: 5, title: 'Fines', description: 'Manage Fines', link: '/fines' }
  // Add more features as needed
];

const Home = () => {
  const backgroundImage = 'url("https://library.utdallas.edu/files/policies-banner.png")';

  return (
    <div
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        padding: '40px',
      }}
    >
      <NavBar/>
      <Container>
      <div style={{ backgroundColor: '#C75A13', padding: '10px', borderRadius: '10px', marginTop:'30px',marginBottom: '30px' }}>
          <Typography variant="h4" gutterBottom align="center" style={{ color: 'white', marginBottom: '30px' }}>
            Welcome to the UTD Library Management
          </Typography>
        </div>
   
        {/*<Grid container spacing={3} justifyContent="center">
          {features.map((feature) => (
            <Grid item key={feature.id} xs={12} sm={6} md={4}>
              <Link to={feature.link} style={{ textDecoration: 'none', width: '100%' }}>
                <Card
                  style={{
                    height: '0',
                    paddingBottom: '30%',
                    //paddingLeft:'90%',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#C75A13',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" align="center" color={'white'} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" align="center" color="white">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
                </Grid>*/}
      </Container>
    </div>
  );
};

export default Home;
