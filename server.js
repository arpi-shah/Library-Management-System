// server.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'library_node',
  });

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.post('/search', (req, res) => {
  const searchText = req.body.searchText;

  // Implement your SQL query based on the provided search criteria
  const query = `
    SELECT book.isbn, book.title, GROUP_CONCAT(authors.name) AS authors, 
    CASE WHEN book_loans.loan_id IS NOT NULL AND book_loans.date_in IS NULL THEN 'Checked Out' ELSE 'Available' END AS Availability
    FROM book
    LEFT JOIN book_authors ON book.isbn = book_authors.isbn
    LEFT JOIN authors ON book_authors.author_id = authors.author_id
    LEFT JOIN book_loans ON book.isbn = book_loans.isbn
    WHERE
      LOWER(book.isbn) LIKE LOWER('%${searchText}%') OR
      LOWER(book.title) LIKE LOWER('%${searchText}%') OR
      LOWER(authors.name) LIKE LOWER('%${searchText}%')
    GROUP BY book.isbn,book.title
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json(results);
    }
  });
});


app.post('/checkout', async (req, res) => {
    const { isbn, borrowerId, dateOut, dueDate } = req.body;
  
    try {
      // Check the number of active book loans for the borrower
      const AvailabilityQ= `
      SELECT count(*) AS a
      FROM book_loans
      WHERE isbn = ? and date_in is NULL
    `;
    const availabilityResult = await new Promise((resolve, reject) => {
      db.query(AvailabilityQ, [isbn], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
     
      const available = availabilityResult[0].a;
      
      const activeLoansQuery = `
        SELECT COUNT(*) AS activeLoans
        FROM book_loans
        WHERE card_id = ? AND date_in IS NULL
      `;
      const activeLoansResult = await new Promise((resolve, reject) => {
        db.query(activeLoansQuery, [borrowerId], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      
      const activeLoansCount = activeLoansResult[0].activeLoans;
  
      if (activeLoansCount > 2 || available > 0) {
        //console.log('Book checked out successfully!',available);
        return res.status(400).json({ message: 'Book Not available to checkout or Maximum active book loans reached for this borrower.' });

      } else {
  
        // If the borrower has less than 3 active loans, proceed with checkout
        const insertLoanQuery = `
        INSERT INTO book_loans (isbn, card_id, date_out, due_date)
        VALUES (?, ?, ?, ?)
      `;
        db.query(
          insertLoanQuery,
          [isbn, borrowerId, dateOut, dueDate],
          (error, result) => {
            if (error) {
              console.error('Error inserting into BOOK_LOANS:', error);
              res.status(500).json({ message: 'Error checking out book' });
            } else {
              console.log('Book checked out successfully!',available,activeLoansCount);
              res.status(200).json({ message: 'Book checked out successfully' });
            }
          }
        );
      }
    } catch (error) {
      console.error('Error occurred during checkout:', error);
      res.status(500).json({ message: 'Error occurred during checkout' });
    }
  });
  
//Add Borrower
  app.post('/insertborrower', async (req, res) => {
    const { card_id,ssn,bname,address,phone } = req.body;
  
    try {
      // Check the number of active book loans for the borrower
      const ssnExist = `
        SELECT COUNT(*) AS exist
        FROM borrower
        WHERE ssn = ?
      `;
      const ssnExistResult = await new Promise((resolve, reject) => {
        db.query(ssnExist, [ssn], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  
        const ssnCount = ssnExistResult[0].exist;
        console.log(ssnCount);
  
      if (ssnCount > 0) {
        res.status(400).json({ message: 'Borrower already exists.' });
      }
  
      // If the borrower has less than 3 active loans, proceed with checkout
      const insertBorrower = `
        INSERT INTO borrower (card_id, ssn, bname, address, phone)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(
        insertBorrower,
        [card_id,ssn,bname,address,phone],
        (error, result) => {
          if (error) {
            console.error('Error inserting into  Borrowers', error);
            res.status(500).json({ message: 'Error inserting borrower' });
          } else {
            console.log('Borrower added successfully!');
            res.status(200).json({ message: 'Borrower added successfully' });
          }
        }
      );
    } catch (error) {
      console.error('Error occurred during inserting:', error);
      res.status(500).json({ message: 'Error occurred during inserting' });
    }
  });

//checkin
  
app.post('/checkin', (req, res) => {
    const searchText = req.body.searchText;
  
    // Implement your SQL query based on the provided search criteria
    const query = `
    SELECT book_loans.loan_id,book_loans.date_in,book.isbn, book.Title, borrower.card_id, borrower.bname
            FROM book_loans
            LEFT JOIN book ON book.isbn = book_loans.isbn
            LEFT JOIN borrower ON book_loans.card_id = borrower.card_id
            WHERE book_loans.date_in IS NULL AND (book.isbn LIKE '%${searchText}%' OR borrower.card_id LIKE '%${searchText}%' 
            OR borrower.bname LIKE '%${searchText}%')
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  });

app.post('/confirmcheckin', (req, res) => {
    const {loan_id, date_in} = req.body;
  
    // Implement your SQL query based on the provided search criteria
    const query = `
    UPDATE book_loans SET date_in = ? WHERE loan_id = ?
    `;
  
    db.query(query,[date_in,loan_id], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json({ message: 'Check In successfull' });
      }
    });
  });

  app.get('/fines', (req, res) => {
    const { showPaid } = req.query;
    // Use the showPaid query parameter to determine whether to fetch paid fines as well
  
    let query = 'SELECT b.card_id, SUM(fine.fine_amt) as total_fine FROM fines fine JOIN book_loans bl ON fine.loan_id = bl.loan_id JOIN borrower b ON bl.card_id = b.card_id where paid = 0';

  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching fines:', error);
        res.status(500).json({ message: 'Error fetching fines' });
      } else {
        res.status(200).json(results);
      }
    });
  });

  app.put('/confirmpay/:card_id',  (req, res) => {
    const { card_id } = req.params;
                   
    // Retrieve loan_ids associated with the provided card_id
    const getLoanIdsQuery = 'SELECT loan_id FROM book_loans WHERE card_id = ?';
    db.query(getLoanIdsQuery, [card_id], async (error, results) => {
      if (error) {
        console.error('Error fetching loan_ids:', error);
        res.status(500).json({ message: 'Error fetching loan_ids' });
      } else {
        const loanIds = results.map((row) => row.loan_id);
        
        const checkReturn= `
        SELECT count(*) AS a
        FROM book_loans
        WHERE loan_id in (?) and date_in is NULL
      `;
        
      const checkResult = await new Promise((resolve, reject) => {
        db.query(checkReturn, [loanIds], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
       
        const check = checkResult[0].a;
        // Update paid value to 1 for loan_ids in the fines table
        if (check > 0) {
          console.log('Book(s) are still out');
          res.status(500).json({ message: 'Book(s) are still out' });
        } else {
          const updatePaidQuery = 'UPDATE fines SET paid = 1 WHERE loan_id IN (?)';
          db.query(updatePaidQuery, [loanIds], (updateError) => {
            if (updateError) {
              console.error('Error updating paid value:', updateError);
              res.status(500).json({ message: 'Error updating paid value' });
            } else {
              res.status(200).json({ message: 'Fines paid successfully' });
            }
          });
        }
      }
    });
  });

  app.put('/updatefines', (req, res) => {
    const updateFinesQuery = `
    INSERT INTO fines (loan_id, fine_amt, paid)
    SELECT bl.loan_id, 
    CASE
     WHEN bl.date_in is NULL THEN DATEDIFF(CURDATE(),bl.due_date) * 0.25
     ELSE DATEDIFF(bl.date_in,bl.due_date) * 0.25
     END as diff , 0
    FROM book_loans bl
    WHERE DATEDIFF(CURDATE(),bl.due_date) * 0.25 > 0
    ON DUPLICATE KEY UPDATE fine_amt = VALUES(fine_amt)
    `;
  
    db.query(updateFinesQuery, (error, results) => {
      if (error) {
        console.log(error)
        console.error('Error updating fines:', error);
        res.status(500).json({ message: 'Error updating fines' });
      } else {
        res.status(200).json({ message: 'Fines updated successfully' });
      }
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
