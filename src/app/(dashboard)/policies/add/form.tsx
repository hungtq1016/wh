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
            <InputLabel htmlFor="title">Title</InputLabel>
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
                ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
              }}
              value={formState.content}
              onEditorChange={(content, editor) => {
                formDispatch({ type: 'CHANGE', field: 'content', value: content });
              }}
            />
          </div>
        </div>
        <div className='flex justify-end mt-5 gap-2'>
          <Link href='/policies'>
            <Button type='button' variant="text">Cancel</Button>
          </Link>
          <Button disabled={loading} type='submit' variant="contained">Submit</Button>
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