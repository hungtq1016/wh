"use client";

import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TextField } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'sku', headerName: 'SKU', width: 130 },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 90,
  },
  {
    field: 'salePrice',
    headerName: 'Sale Price',
    type: 'number',
    width: 90,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 90,
  },
  {
    field: 'description',
    headerName: 'Description',
    description: 'This column has a value getter and is not sortable.',
    sortable: false
  },
];

export default function DataTable({rows}:{rows:any}) {
  
  return (
    <div style={{ height: 400, width: '100%' }}>
        <div className='py-5'>
            <TextField
                className='w-full'
                id="outlined-required"
                label="Search"
                placeholder='Search...'
            />
        </div>    
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: 5 },
            },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
        />
    </div>
  );
}
