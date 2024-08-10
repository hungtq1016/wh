'use client'
import * as React from 'react';
import ImageModal from '@/ui/modals/image.modal';
import { Button, Checkbox, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Image from 'next/image';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { slugify } from '@/services/utils/string.util';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { useQuill } from 'react-quilljs';

const suffixes = [
  {
    value: 'shipping',
    label: 'Shipping',
  },
  {
    value: 'refund',
    label: 'Refund',
  },
  {
    value: 'privacy',
    label: 'Privacy',
  },
  {
    value: 'terms',
    label: 'Terms of Service',
  }
]
export default function PolicyFrom() {
  const router = useRouter();
  const formReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'CHANGE':
        return {
          ...state,
          [action.field]: action.value,
        };
      case 'CLEAR':
        return initialState
      default:
        return state;
    }
  };

  const initialState = {
    title: '',
    content: '',
    suffix: '',
  };

  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  const [loading, setLoading] = React.useState(false);
  const { quill, quillRef } = useQuill();

  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        formDispatch({ type: 'CHANGE', field: 'description', value: quill.getSemanticHTML() })
      });
      quill.clipboard.dangerouslyPasteHTML(formState.description);
    }
  }, [quill]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    axios.post('/api/v1/policies', formState)
      .then((res) => {
        toast.success('Policy created successfully');
      })
      .catch((error) => {
        if (error.response.data.status)
          toast.error(error.response.data.message)
        else
          toast.error('Error while creating policy');
      })
      .finally(() => {
        setLoading(false)
        formDispatch({ type: 'CLEAR' });
        router.push('/policies');
      });
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='grid grid-cols-12 gap-3 mt-5'>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 space-y-2'>
            <InputLabel htmlFor="title">Tiêu Đề</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="title"
              required
              placeholder='Policy Name'
              value={formState.title}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'title', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 space-y-2'>
            <InputLabel htmlFor="suffix">Suffix</InputLabel>
            <Select
              className='w-full'
              size='small'
              id="suffix"
              value={formState.suffix}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'suffix', value: e.target.value })}
            >
              {
                suffixes.map((suffix, index) => (
                  <MenuItem key={index} value={suffix.value}>{suffix.label}</MenuItem>
                ))
              }
            </Select>
          </div>
          <div className='col-span-12 space-y-2'>
            <InputLabel htmlFor='content'>Nội Dung Hiển Thị</InputLabel>
            <div style={{ height: 300 }}>
              <div ref={quillRef} />
            </div>
          </div>
        </div>
        <div className='flex justify-end mt-5 gap-2'>
          <Link href='/policies'>
            <Button type='button' variant="text">Trở Về</Button>
          </Link>
          <Button disabled={loading} type='submit' variant="contained">Xác Nhận</Button>
        </div>
      </form>
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
    </>
  )
}