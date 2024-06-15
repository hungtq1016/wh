"use client";

import * as React from 'react';
import { DataGrid, GridColDef} from "@mui/x-data-grid";
import { TextField } from '@mui/material';
import { Dropdown, MenuItem,MenuButton, Menu } from '@mui/base';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query'
import { queryString } from '@/services/utils/url.util';
import { useComments } from '@/libs/hook/useComments';

export default function ProductComment() {
  const router = useRouter()
  
  const query : {pageNumber?: string, pageSize?: string} = queryString()
  const pageNumber = query.pageNumber || 1
  const pageSize = query.pageSize || 10

  const {data,isLoading,refetch} = useQuery({
    queryKey: ['comments', pageNumber, pageSize],
    // eslint-disable-next-line react-hooks/rules-of-hooks
    queryFn: () => useComments(pageNumber, pageSize)
  })

  if(isLoading){
    return <div>Loading...</div>
  }

  if (data === undefined) {
    return <div>Error</div>
  }

  const rows = data.data.data.data

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Mã', width: 70 },
    { field: 'author', headerName: 'Tác giả', width: 130 },
    { field: 'color', headerName: 'Màu', width: 130 },
    { field: 'rating', headerName: 'Đánh giá', type: 'number', width: 90, },
    { field: 'content', headerName: 'Nội dung', width: 200, },
    { field: 'upVote', headerName: 'Up', type: 'number', width: 90, },
    { field: 'downVote', headerName: 'Down', type: 'number', width: 90, },
    {
      field: "action",
      headerName: "Hành động",
      renderCell: ({row}) => {
        const copyToClipboard = async () => {
          await navigator.clipboard.writeText(row.id)
 
        }
        const handleDelete = async () => {
          const submit = confirm('Are you sure you want to delete this product?')
          if(submit){
            await axios.delete(`/api/v1/comments/id/${row.id}`).then(() => {
                refetch()
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
                paginationModel: { page: 0, pageSize: 10 },
            },
            }}
            pageSizeOptions={[10, 25]}
        />
    </div>
  );
}
