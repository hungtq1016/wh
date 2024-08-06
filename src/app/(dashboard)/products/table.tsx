"use client";

import * as React from 'react';
import { DataGrid, GridColDef} from "@mui/x-data-grid";
import { TextField } from '@mui/material';
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
    getData("/api/v1/products").then((data) => {
      const { data: rows, metadata } = data
      setRows(rows)
    })
  }, [])

  const handleSale = async (id: string) => {
    const row = rows.find((r) => r.id === id)
    row.isSale = !Boolean(row.isSale)
    await axios.put(`/api/v1/products/id/${id}`,row).then(() => {
    
    })
  }

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
      field: 'isSale',
      headerName: 'Is Sale',
      type: 'boolean',
      renderCell: ({row}) => {
        return (
          <Switch
            checked={row.isSale}
            onChange={() => handleSale(row.id)}
            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-red-600/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-600/10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
        );
      }
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
    {
      field: 'images',
      headerName: 'Hình Ảnh',
      description: 'This column has a value getter and is not sortable.',
      renderCell: ({row}) => {
     
        return (
          <span>{row._count.images}</span>
        );
      }
    },
    {
      
      field: "action",
      headerName: "Action",
      
      renderCell: ({row}) => {

        const viewProduct = () => {
          router.push(`/products/${row.id}`)
        }
        const copyToClipboard = async () => {
          await navigator.clipboard.writeText(row.id)
 
        }
  
        const handleDelete = async () => {
          const submit = confirm('Are you sure you want to delete this product?')
          if(submit){
            await axios.delete(`/api/v1/products/id/${row.id}`).then(() => {
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
              onClick={viewProduct}>View Detail</MenuItem>
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
