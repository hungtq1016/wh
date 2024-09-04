"use client";

import * as React from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, InputLabel, TextField } from '@mui/material';
import { Dropdown, MenuItem, MenuButton, Menu } from '@mui/base';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import ImageModal from '@/ui/modals/image.modal';
import { v4 } from 'uuid';
import { useQuill } from 'react-quilljs';

const getData = async (route: string) => {
  const response = await axios.get(route);
  return response.data.data;
};



export default function CollectionExhibition({collectionId}:{collectionId:string}) {

  const initialState = {
    id: '',
    title: '',
    collectionId: collectionId,
    desccription: '',
    images: [] as any[],
    image:''
  }

  const [rows, setRows] = React.useState<any[]>([]);
  const [formState, setFormState] = React.useState({ ...initialState });
  const [loading, setLoading] = React.useState(false);
  const [update, setUpdate] = React.useState(false);

  const { quill, quillRef } = useQuill();

  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => handleChange('desccription', quill.getSemanticHTML()))
      quill.clipboard.dangerouslyPasteHTML(formState.desccription);
    }
  }, [quill]);

  React.useEffect(() => {
    getData("/api/v1/exhibition/collectionId/"+collectionId).then((data) => {
      console.log(data)
      setRows(data);
    });
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this exhibition?');
    if (confirmDelete) {
      await axios.delete(`/api/v1/exhibition/id/${id}`).then(() => {
        setRows((prevRows) => prevRows.filter((row: any) => row.id !== id));
      });
    }
  };

  const handleImageDelete = async (index: number) => {
    setLoading(true);
    try {
      await axios.delete(`/api/v1/images/id/${formState.images[index].id}`);
      toast.success('Image deleted successfully');
      setFormState((prevState) => ({
        ...prevState,
        images: prevState.images.filter((_, i) => i !== index)
      }));
    } catch {
      toast.error('Error while deleting image');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('/api/v1/exhibition/id/' + formState.id, formState);
      toast.success('Exhibitions updated successfully');
      setRows((prevRows) => prevRows.map((row: any) => row.id === formState.id ? formState : row));
    } catch {
      toast.error('Error while updating exhibition');
    } finally {
      setLoading(false);
      setUpdate(false);
    }
  }

  const handleCreate = async () => {
    setLoading(true);
      try {
        formState.id = v4();
        await axios.post('/api/v1/exhibition', formState);
        toast.success('Exhibition created successfully');
        setRows([formState]);
        setFormState({ ...initialState });
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error while creating exhibition');
      } finally {
        setLoading(false);
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (update) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const onRowClick = (row: any) => {
    setFormState(row);
    setUpdate(true)
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Tiêu Đề', width: 130 },
    { field: 'link', headerName: 'Đường Dẫn', width: 130 },
    { field: 'desccription', headerName: 'Nội Dung', sortable: false },
    {
      field: 'images',
      headerName: 'Hình Ảnh',
      sortable: false,
      renderCell: ({ row }: { row: any }) => {
        return (<><Image
          width={80}
          height={80}
          src={row.image}
          alt={row.title}
          className='w-full h-40 object-cover rounded'
        /></>)
      }
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: ({ row }) => (
        <Dropdown className="relative inline-block text-left">
          <MenuButton className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Action</MenuButton>
          <Menu className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <MenuItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => onRowClick(row)}>Cập Nhật</MenuItem>
            <MenuItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => navigator.clipboard.writeText(row.id)}>Copy</MenuItem>
            <MenuItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => handleDelete(row.id)}>Xóa</MenuItem>
          </Menu>
        </Dropdown>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-12 gap-3 mt-5'>
            <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 space-y-2'>
              <InputLabel htmlFor="title">Tiêu Đề</InputLabel>
              <TextField
                className='w-full'
                size='small'
                id="title"
                required
                placeholder='Tiêu Đề...'
                value={formState.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            {
              formState.images.length > 0 ?
                <div className='col-span-12 space-y-2'>
                  <InputLabel>Hình Ảnh</InputLabel>
                  <div className='flex flex-wrap gap-3'>
                    {
                      formState.images.map((image, index) => (
                        <div key={index} className='relative rounded'>
                          <Image
                            width={80}
                            height={80}
                            src={image.url}
                            alt={image.alt}
                            className='w-full h-40 object-cover rounded'
                          />
                          <div className='absolute inset-0 bg-black/20 rounded' />
                          <div className='absolute z-10 top-1 right-1'>
                            <button type='button' onClick={() => handleImageDelete(index)}>
                              <XMarkIcon className='size-4 text-red-600' />
                            </button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                :
                <ImageModal
                  multiple={false}
                  handleUpdate={(images: any) =>{
                    handleChange('images', images)
                    handleChange('image', images[0].url)
                  }}
                  className='col-span-12 space-y-2'
                />
            }
            <div className='col-span-12 space-y-2'>
              <InputLabel htmlFor='desccription'>Nội Dung Hiển Thị</InputLabel>
              <div style={{ height: 300 }}>
                <div ref={quillRef} />
              </div>
            </div>
          </div>
          <div className='flex justify-end mt-5 gap-2'>
            <Button disabled={loading} type='submit' variant="contained">Xác Nhận</Button>
          </div>
        </form>
      </div>
      <div className='w-full h-[600px]'>
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
      {
        loading && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="flex items-center justify-center">
            {
              "Loading...".split('').map((char, index) => (
                <div
                  key={index}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-bounce text-5xl text-gray-800">{char}</div>
              ))
            }
          </div>
        </div>)
      }
    </div>

  );
}
