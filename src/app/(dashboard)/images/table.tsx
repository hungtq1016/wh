"use client";
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import * as React from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField } from '@mui/material';
import { Dropdown, MenuItem, MenuButton, Menu } from '@mui/base';
import axios from 'axios';
import { urlBuilder } from '@/services/utils/url.util';
import Image from 'next/image';
import Link from 'next/link';
import { PencilIcon } from '@heroicons/react/24/outline';

const getData = async (route: string) => {
  const response = await axios.get(route)

  return response.data.data || []
}

function useHandleEdit({ row }: { row: any }) {
  const [open, setOpen] = React.useState(false);
  const [altValue, setAltValue] = React.useState(row.alt);
  // if escape key is pressed, close the input

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.put(`/api/v1/images/id/${row.id}`, row)
      .then(() => { })
      .catch((err) => )
      .finally(() => setOpen(!open))
  }

  return (
    <div className='truncate relative flex gap-1 justify-between items-center group h-full'>
      {open ? (
        <form onSubmit={handleSubmit} className='flex-auto'>
          <div className='flex flex-col justify-between gap-2'>
            <input
              type='text'
              className='w-full bg-gray-100 rounded-md px-2 py-1 text-sm'
              value={altValue}
              onChange={(e) => {
                setAltValue(e.target.value);
                row.alt = e.target.value; // Update the row's alt value
              }}
            />
            <div className='text-xs mt-0'>escape to <span className='font-semibold text-blue-600'>cancel</span> • enter to <span className='font-semibold text-blue-600'>save</span></div>
          </div>
          <input type="submit" className='hidden' />
        </form>
      ) : (
        <p className='text-sm truncate'>{altValue}</p>
      )}
      <button
        onClick={() => setOpen(!open)}
        className='hidden group-hover:inline-flex items-center justify-center'
      >
        <PencilIcon className='size-4 text-gray-600' />
      </button>
    </div>
  );
}

export default function DataTable({ query, route }: { query?: any, route?: string }) {

  const [rows, setRows] = React.useState<any[]>([]);
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState('')
  React.useEffect(() => {
    getData(urlBuilder("/api/v1/images", query)).then((data) => {
      const { data:rows, metadata } = data
      setRows(rows)
    })
  }, [query])

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
      width: 384,
      renderCell: useHandleEdit
    },
    {
      field: 'source',
      headerName: 'Source',
      renderCell: ({ row }) => {
        switch (route) {
          case 'users':
            return 'User';
          case 'products':
            return <Link
              href={`/${route}/${row.productId}`}
              className='text-blue-600'>Link</Link>;
          default:
            return 'Unknown';
        }
      }
    },
    {

      field: "action",
      headerName: "Action",

      renderCell: ({ row }) => {

        const handleOpen = () => {
          setIsOpen(!isOpen)
          setSelectedImage(row.url)
        }

        const copyToClipBoard = async (value: string) => {
          await navigator.clipboard.writeText(value)
        };

        const handleDelete = async () => {
          const submit = confirm('Are you sure you want to delete this image?')
          if (submit) {
            await axios.delete(`/api/v1/images/id/${row.id}`).then(() => {
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
                onClick={handleOpen}>View Full Image</MenuItem>
              <MenuItem
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => copyToClipBoard(row.id)}>Copy Id</MenuItem>
              <MenuItem
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => copyToClipBoard(row.url)}> Copy url </MenuItem>
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
    <>
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
          rowHeight={80}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}

        />
      </div>
      <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpen(!isOpen)}>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-blue-600/20 p-20">
            <div className="flex min-h-full items-center justify-center">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full h-full backdrop-blur-2xl">
                  <div className="flex justify-center items-center w-full h-full">
                    {/* default image size */}
                    <Image
                      src={selectedImage}
                      alt='image'
                      width={0}
                      height={0}
                      className='w-4/5 h-auto object-contain'
                    />
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>

        </Dialog>
      </Transition>
    </>
  );
}
