'use client'
import * as React from 'react';
import ImageModal from '@/ui/modals/image.modal';
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useQuill } from 'react-quilljs';
import { HexColorPicker } from "react-colorful";

const initialState = {
  title: '',
  content: '',
  dateTime: '',
  color: '#000000',
  chapter: 0,
  image: '',
  description: '',
  images: []
};

const getData = async (route: string) => {
  const response = await axios.get(route)
  return response.data.data || []
}

export default function CollectionFrom() {

  const param = useParams();
  const {id} = param;

  const formReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'UPDATE':
        return {
          ...state,
          ...action.data
        }
      case 'CHANGE':
        return {
          ...state,
          [action.field]: action.value,
        };
      default:
        return state;
    }
  };

  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  const [loading, setLoading] = React.useState(false);
  const { quill, quillRef } = useQuill();

  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        formDispatch({ type: 'CHANGE', field: 'content', value: quill.getSemanticHTML() })
      });
      quill.clipboard.dangerouslyPasteHTML(formState.content);
    }
  }, [quill]);

  const onImageUpdate = (images: any) => {
    formDispatch({ type: 'CHANGE', field: 'images', value: images });
    formDispatch({ type: 'CHANGE', field: 'image', value: images[0].url });
  }

  React.useEffect(() => {
    getData("/api/v1/collections/id/"+id).then((res) => {
      formDispatch({ type: 'UPDATE', data: res })
    })
  }, [id])

  const onDeleteImage = (index: number) => {
    setLoading(true);
    axios.delete(`/api/v1/images/id/${formState.images[index].id}`)
      .then((res) => {
        toast.success('Image deleted successfully!');
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        formDispatch({ type: 'CHANGE', field: 'images', value: formState.images.filter((img: any, i: number) => i !== index) });
        setLoading(false)
      });
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    axios.put(`/api/v1/collections/id/${id}`, formState)
      .then((res) => {
        toast.success('Collection updated successfully!');
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setLoading(false)
     
      });
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='grid grid-cols-12 gap-3 mt-5'>
          <div className='col-span-12 md:col-span-6 space-y-2'>
            <InputLabel htmlFor="title">Tiêu Đề</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="title"
              required
              placeholder='Tiêu Đề...'
              value={formState.title}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'title', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 space-y-2'>
            <InputLabel htmlFor="dateTime">Thời Gian</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="dateTime"
              placeholder='Thời Gian...'
              value={formState.dateTime}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'dateTime', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 space-y-2'>
            <InputLabel htmlFor="description">Mô Tả</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="description"
              placeholder='Mô Tả...'
              value={formState.description}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'description', value: e.target.value })}
            />
          </div>

          <div className='col-span-12 md:col-span-6 space-y-2'>
            <InputLabel htmlFor="chapter">Chọn Chương</InputLabel>
            <Select
              id="chapter"
              value={formState.chapter}
              className='w-full'
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'chapter', value: e.target.value })}
            >
              <MenuItem value={0}>Vui Lòng Chọn</MenuItem>
              {
                Array.from(Array(12), (e, i) => <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>)
              }
            </Select>
          </div>
          {
            formState.images.length > 0 ?
              <div className='col-span-12 md:col-span-6 space-y-2'>
                <InputLabel>Hình Ảnh</InputLabel>
                <div className='flex flex-wrap gap-3'>
                  {
                    formState.images.map((image: any, index: number) => (
                      <div key={index} className='relative rounded'>
                        <Image
                          width={80}
                          height={80}
                          src={image.url}
                          alt={image.alt}
                          className='w-full h-40 object-cover rounded' />
                        <div className='absolute inset-0 bg-black/20 rounded' />
                        <div className='absolute z-10 top-1 right-1'>
                          <button type='button' onClick={() => onDeleteImage(index)}>
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
                handleUpdate={onImageUpdate}
                className='col-span-12 md:col-span-6 space-y-2' />
          }
          <div className='col-span-12 md:col-span-6 space-y-2'>
            <InputLabel htmlFor="color">Chọn Màu Chủ Đạo</InputLabel>
            <HexColorPicker
              color={formState.color}
              className='!w-full'
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'color', value: e })} />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 space-y-2'>
            <InputLabel htmlFor='description'>Nội Dung</InputLabel>
            <div style={{ height: 300 }}>
              <div ref={quillRef} />
            </div>
          </div>
        </div>
        <div className='flex justify-end mt-5 gap-2'>
          <Link href='/collections'>
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