"use client";

import * as React from 'react';
import { DataGrid, GridColDef} from "@mui/x-data-grid";
import { TextField } from '@mui/material';
import { Dropdown, MenuItem,MenuButton, Menu } from '@mui/base';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const getData = async (route: string) => {
  const response = await axios.get(route)
  return response.data.data
}

export default function DataTable() {
  const router = useRouter()
  const [rows, setRows] = React.useState<any[]>([]);
  React.useEffect(() => {
    getData("/api/v1/policies").then((data) => {
      const { data: rows, metadata } = data
      setRows(rows)
    })
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Tiêu Đề',  },
    { field: 'content', headerName: 'Nội Dung', width: 230 },
    { field: 'suffix', headerName: 'suffix', width: 90, },
    {
      field: "action",
      headerName: "Action",
      renderCell: ({row}) => {
        const viewPolicy = () => {
          router.push(`/policies/${row.id}`)
        }
        const copyToClipboard = async () => {
          await navigator.clipboard.writeText(row.id)
 
        }
        const handleDelete = async () => {
          const submit = confirm('Are you sure you want to delete this policy?')
          if(submit){
            await axios.delete(`/api/v1/policies/id/${row.id}`).then(() => {
              setRows(rows.filter((r) => r.id !== row.id))
            })
          }
        }
        return (
          <Dropdown className="relative inline-block text-left">
            <MenuButton 
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >Action</MenuButton>
            <Menu className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <MenuItem 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={viewPolicy}>View Detail</MenuItem>
              <MenuItem 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={copyToClipboard}> Copy </MenuItem>
              <MenuItem 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleDelete}>Xóa</MenuItem>
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
                placeholder='Tìm Kiếm...'
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
