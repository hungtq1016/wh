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

const getData = async (route: string) => {
  const response = await axios.get(route);
  return response.data.data;
};

const initialState = {
  id: '',
  title: '',
  link: '',
  content: '',
  position: 'home-creation',
  images: [] as any[]
}

export default function DataTable() {

  const [rows, setRows] = React.useState<any[]>([]);
  const [formState, setFormState] = React.useState({...initialState});
  const [loading, setLoading] = React.useState(false);
  const [update, setUpdate] = React.useState(false);

  React.useEffect(() => {
    getData("/api/v1/billboards/position/home-creation").then((data) => {
      setRows(data);
    });
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this billboard?');
    if (confirmDelete) {
      await axios.delete(`/api/v1/billboards/id/${id}`).then(() => {
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
      await axios.put('/api/v1/billboards/id/'+formState.id, formState);
      toast.success('Billboards updated successfully');
      setRows((prevRows) => prevRows.map((row: any) => row.id === formState.id ? formState : row));
    } catch {
      toast.error('Error while updating billboards');
    } finally {
      setLoading(false);
      setUpdate(false);
    }
  }

  const handleCreate = async () => {
    if (rows.length > 0) {
      toast.error('Creation only allows one billboard');
    } else {
      setLoading(true);
      try {
        formState.id = v4();
        await axios.post('/api/v1/billboards', formState);
        toast.success('Billboard created successfully');
        setRows([formState]);
        setFormState({...initialState});
      } catch (error:any) {
        toast.error(error.response?.data?.message || 'Error while creating billboard');
      } finally {
        setLoading(false);
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (update) {
      handleUpdate();
    }else{
      handleCreate();
    }
  };

  const onRowClick = (row: any) => {
    setFormState(row);
    setUpdate(true)
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 130 },
    { field: 'link', headerName: 'Link', width: 130 },
    { field: 'content', headerName: 'Content', sortable: false },
    {
      field: 'images',
      headerName: 'Images',
      sortable: false,
      renderCell: ({ row }: { row: any }) => {
        return row.images.map((image: any, index: number) => (
          <Image
            key={index}
            width={80}
            height={80}
            src={image.url}
            alt={image.alt}
            className='w-full h-40 object-cover rounded'
          />
        ));
      }
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: ({ row }) => (
        <Dropdown className="relative inline-block text-left">
          <MenuButton className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Action</MenuButton>
          <Menu className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <MenuItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => onRowClick(row)}>Update</MenuItem>
            <MenuItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => navigator.clipboard.writeText(row.id)}>Copy</MenuItem>
            <MenuItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => handleDelete(row.id)}>Delete</MenuItem>
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
              <InputLabel htmlFor="title">Title</InputLabel>
              <TextField
                className='w-full'
                size='small'
                id="title"
                required
                placeholder='Title'
                value={formState.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 space-y-2'>
              <InputLabel htmlFor="link">Link</InputLabel>
              <TextField
                className='w-full'
                size='small'
                id="link"
                required
                placeholder='Link'
                value={formState.link}
                onChange={(e) => handleChange('link', e.target.value)}
              />
            </div>
            {
              formState.images.length > 0 ?
                <div className='col-span-12 space-y-2'>
                  <InputLabel>Images</InputLabel>
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
                  multiple={true}
                  handleUpdate={(images:any) => handleChange('images', images)}
                  className='col-span-12 space-y-2'
                />
            }
            <div className='col-span-12 space-y-2'>
              <InputLabel htmlFor='content'>Content</InputLabel>
              <Editor
                apiKey='djw4c7uq7gsbbh61pf3lb9ysv0rtt0rq159cg1mzs8xkarpy'
                id='content'
                init={{
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                  tinycomments_mode: 'embedded',
                  tinycomments_author: 'Author name',
                  mergetags_list: [
                    { value: 'First.Name', title: 'First Name' },
                    { value: 'Email', title: 'Email' },
                  ],
                  ai_request: (request:any, respondWith:any) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
                }}
                value={formState.content}
                onEditorChange={(content) => handleChange('content', content)}
              />
            </div>
          </div>
          <div className='flex justify-end mt-5 gap-2'>
            <Button disabled={loading} type='submit' variant="contained">Submit</Button>
          </div>
        </form>
      </div>
      <div className='w-full h-[600px]'>
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
