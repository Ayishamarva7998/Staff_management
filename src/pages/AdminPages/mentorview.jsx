import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from '@mui/material';

const createData = (name, joined, email, phoneNumber, role, totalReview, status) => {
  return { name, joined, email, phoneNumber, role, totalReview, status };
};

const rows = [
  createData('Reviewer 1', 'September 9, 2013', 'reviewer1@gmail.com', '123-456-7890', 'Admin', 110, 'Details'),
  createData('Reviewer 2', 'August 2, 2013', 'reviewer2@gmail.com', '123-456-7891', 'User', 100, 'Details'),
  createData('Reviewer 3', 'September 24, 2017', 'reviewer3@gmail.com', '123-456-7892', 'Admin', 100, 'Details'),
  createData('Reviewer 4', 'December 28, 2012', 'reviewer4@gmail.com', '123-456-7893', 'User', 100, 'Details'),
  createData('Reviewer 5', 'May 20, 2016', 'reviewer5@gmail.com', '123-456-7894', 'Admin', 100, 'Details'),
  createData('Reviewer 6', 'May 31, 2015', 'reviewer6@gmail.com', '123-456-7895', 'User', 100, 'Details'),
  createData('Reviewer 7', 'February 29, 2012', 'reviewer7@gmail.com', '123-456-7896', 'Admin', 100, 'Details'),
  createData('Reviewer 8', 'October 24, 2018', 'reviewer8@gmail.com', '123-456-7897', 'User', 100, 'Details'),
  createData('Reviewer 9', 'November 7, 2017', 'reviewer9@gmail.com', '123-456-7898', 'Admin', 100, 'Details'),
  createData('Reviewer 10', 'May 28, 2017', 'reviewer10@gmail.com', '123-456-7899', 'User', 100, 'Details'),
  createData('Reviewer 11', 'July 14, 2015', 'reviewer11@gmail.com', '123-456-7800', 'Admin', 100, 'Danger'),
  createData('Reviewer 12', 'December 19, 2013', 'reviewer12@gmail.com', '123-456-7801', 'User', 100, 'Danger'),
  createData('Reviewer 13', 'December 2, 2018', 'reviewer13@gmail.com', '123-456-7802', 'Admin', 100, 'Details'),
  createData('Reviewer 14', 'March 8, 2018', 'reviewer14@gmail.com', '123-456-7803', 'User', 100, 'Details'),
  createData('Reviewer 15', 'October 30, 2017', 'reviewer15@gmail.com', '123-456-7804', 'Admin', 100, 'Details'),
  createData('Reviewer 16', 'February 8, 2015', 'reviewer16@gmail.com', '123-456-7805', 'User', 100, 'Details'),
  // Add more rows as needed
];

const DataTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead style={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Total Review</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.joined}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.totalReview}</TableCell>
                <TableCell>
                  <Button variant="contained" color={row.status === 'Danger' ? 'secondary' : 'primary'}>
                    {row.status}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
