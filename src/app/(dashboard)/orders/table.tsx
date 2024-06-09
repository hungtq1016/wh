"use client";

import * as React from 'react';
import { DataGrid, GridColDef} from "@mui/x-data-grid";
import { Select, TextField } from '@mui/material';
import { Dropdown, MenuItem,MenuButton, Menu } from '@mui/base';
import axios from 'axios';
import { Switch } from '@headlessui/react';
import { useRouter } from 'next/navigation';

const getData = async (route: string) => {
  const response = await axios.get(route)
  return response.data.data
}

export default function DataTable() {
  const router = useRouter()
  const [rows, setRows] = React.useState<any[]>([]);
  React.useEffect(() => {
    getData("/api/v1/orders").then((data) => {
      const { data: rows, metadata } = data
      setRows(rows)
    })
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email',  },
    { field: 'fullName', headerName: 'Customer Name', width: 230 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'address', headerName: 'Adress', width: 90, },
    { field: 'city', headerName: 'City' },
    { field: 'district', headerName: 'District' },
    { field: 'ward', headerName: 'ward' },
    { field: 'note', headerName: 'Note' },
    { field: 'payment', headerName: 'Payment', width: 100, renderCell: ({row}) => {
      switch(row.payment){
        case 0:
          return <span>Cash on Delivery</span>
        case 1:
          return <span>Momo</span>
        case 2:
          return <span>ShopeePay</span>
        case 3:
          return <span>ZaloPay</span>
        case 4:
          return <span>Bank Transfer</span>
        default:
          return <span>Unknown</span>
      }}
    },
    { field: 'status', headerName: 'Status', width: 100, renderCell: ({row}) => {
      const handleChange = async (e: any) => {
        row.status = e.target.value
        await axios.put(`/api/v1/orders/id/${row.id}`,row).then(() => {
        })
      }
      return (
        <Select 
        value={row.status}
        onChange={(e:any)=>handleChange(e)}>
          <option value="0">Pending</option>
          <option value="1">Shipping</option>
          <option value="2">Delivered</option>
          <option value="3">Canceled</option>
        </Select>)
    }},
    {
      field: "action",
      headerName: "Action",
      renderCell: ({row}) => {
        const viewOrder = () => {
          router.push(`/orders/${row.id}`)
        }
        const copyToClipboard = async () => {
          await navigator.clipboard.writeText(row.id)
 
        }
        const handleDelete = async () => {
          const submit = confirm('Are you sure you want to delete this order?')
          if(submit){
            await axios.delete(`/api/v1/orders/id/${row.id}`).then(() => {
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
              onClick={viewOrder}>View Detail</MenuItem>
              <MenuItem 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={copyToClipboard}> Copy </MenuItem>
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
