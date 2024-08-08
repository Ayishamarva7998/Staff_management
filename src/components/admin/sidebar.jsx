import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Button
} from '@mui/material';

const createData = (image, name, date, email, totalReview, status) => {
  return { image, name, date, email, totalReview, status };
};

const rows = [
  createData('image1.png', 'Reviewer 1', 'September 9, 2013', 'reviewer1@gmail.com', 110, 'Details'),
  createData('image2.png', 'Reviewer 2', 'August 2, 2013', 'reviewer2@gmail.com', 100, 'Details'),
  // Add more rows here
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
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Total Review</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.name}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.totalReview}</TableCell>
                <TableCell>
                  <Button variant="contained" color={row.status === 'Danger' ? 'secondary' : 'primary'}>
                    {row.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined">...</Button>
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
