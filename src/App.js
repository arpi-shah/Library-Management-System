import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import BookSearch from './BookSearch'; // Import BookSearch component
import CheckoutByISBN from './checkoutByISBN';
import AddBrorrower from './AddBrorrower';
import CheckinBook from './checkin';
import Fines from './fines';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-search" element={<BookSearch />} />
        <Route path="/checkout-by-isbn" element={<CheckoutByISBN />} />
        <Route path="/add-borrower" element={<AddBrorrower />} />
        <Route path="/checkin" element={<CheckinBook />} />
        <Route path="/fines" element={<Fines />} />
        {/* Add more routes for additional features */}
      </Routes>
    </Router>
  );
};

export default App;
