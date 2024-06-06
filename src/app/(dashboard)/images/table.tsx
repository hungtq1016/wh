"use client";

import * as React from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField } from '@mui/material';
import { Dropdown, MenuItem, MenuButton, Menu } from '@mui/base';
import axios from 'axios';
import { urlBuilder } from '@/services/utils/url.util';
import Image from 'next/image';

const getData = async (route: string) => {
  const response = await axios.get(route)

  return response.data.data || []
}

export default function DataTable({query}:{query?: string[]}) {

  const [rows, setRows] = React.useState<any[]>([]);
  React.useEffect(() => {
    getData(urlBuilder("/api/v1/images",query)).then((data) => {
      setRows(data)
    })
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'url',
      headerName: 'Url',
      width: 200,
      renderCell: ({ row }) => {
        return (
          <Image
            src={row.url}
            alt={row.alt}
            width={100}
            height={100}
          />
        )
      }
    },
    {
      field: 'alt',
      headerName: 'Alt',
      width: 200,
    },

    {

      field: "action",
      headerName: "Action",

      renderCell: ({ row }) => {

        const handleDelete = async () => {
          const submit = confirm('Are you sure you want to delete this image?')
          if (submit) {
            await axios.delete(`/api/v1/images/id/${row.id}`).then(() => {
              setRows(rows.filter((r) => r.id !== row.id))
            })
          }
        }

        const createHandleMenuClick = (menuItem: string) => {
          return () => {
            console.log(`Clicked on ${menuItem}`);
          };
        };

        return (
          <Dropdown className="relative inline-block text-left">
            <MenuButton

              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >Action</MenuButton>
            <Menu className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <MenuItem
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={createHandleMenuClick('Profile')}>Profile</MenuItem>
              <MenuItem
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={createHandleMenuClick('Language settings')}>
                Language settings
              </MenuItem>
              <MenuItem
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </Dropdown>
        );
      }
    }
  ];

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

      />
    </div>
  );
}
