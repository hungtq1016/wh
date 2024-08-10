'use client'
import * as React from 'react';
import ImageModal from '@/ui/modals/image.modal';
import { Button, Checkbox, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Image from 'next/image';
import { slugify } from '@/services/utils/string.util';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { useQuill } from 'react-quilljs';

export default function ProductFrom() {
  const router = useRouter();
  const formReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'CHANGE':
        return {
          ...state,
          [action.field]: action.value,
        };
      case 'CHANGE_ATTRIBUTE':
        state.attributes = state.attributes.filter((attr: any) => attr.k !== action.field);
        return {
          ...state,
          attributes: [...state.attributes, { k: action.field, v: action.value }]
        }
      case 'CLEAR':
        return initialState
      default:
        return state;
    }
  };

  const initialState = {
    name: '',
    slug: '',
    description: '',
    about: '',
    sku: '',
    salePrice: 0,
    price: 1000000,
    isSale: false,
    quantity: 1,
    attributes: [
      {
        k: 'page-length',
        v: 50
      },
      {
        k: 'width',
        v: 13
      },
      {
        k: 'length',
        v: 20
      },
      {
        k: 'height',
        v: 2
      },
      {
        k: 'language',
        v: 'vi'
      },
      {
        k: 'cover',
        v: 'hard-cover'
      },
      {
        k: 'free-shipping',
        v: false
      },
      {
        k: 'refund',
        v: false
      }
    ],
    images: []
  };

  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    formDispatch({ type: 'CHANGE', field: 'slug', value: slugify(formState.name) });
  }, [formState.name]);

  const onImageUpdate = (images: any) => {
    formDispatch({ type: 'CHANGE', field: 'images', value: images });
  }

  const { quill: descData, quillRef: descRef } = useQuill();
  const { quill: aboutData, quillRef: aboutRef } = useQuill();

  React.useEffect(() => {
    if (descData) {
      descData.on('text-change', (delta, oldDelta, source) => {
        formDispatch({ type: 'CHANGE', field: 'description', value: descData.getSemanticHTML() })
      });
      descData.clipboard.dangerouslyPasteHTML(formState.description);
    }
  }, [descData]);

  React.useEffect(() => {
    if (aboutData) {
      aboutData.on('text-change', (delta, oldDelta, source) => {
        formDispatch({ type: 'CHANGE', field: 'about', value: aboutData.getSemanticHTML() })
      });
      aboutData.clipboard.dangerouslyPasteHTML(formState.about);
    }
  }, [aboutData]);

  const onDeleteImage = (index: number) => {
    setLoading(true);
    axios.delete(`/api/v1/images/id/${formState.images[index].id}`)
      .then((res) => {
        toast.success('Image deleted successfully');
      })
      .catch((error) => {
        toast.error('Error while deleting image');
      })
      .finally(() => {
        formDispatch({ type: 'CHANGE', field: 'images', value: formState.images.filter((img: any, i: number) => i !== index) });
        setLoading(false)
      });
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    axios.post('/api/v1/products', formState)
      .then((res) => {
        toast.success('Product created successfully');
      })
      .catch((error) => {
        if (error.response.data.status)
          toast.error(error.response.data.message)
        else
          toast.error('Error while creating product');
      })
      .finally(() => {
        setLoading(false)
        formDispatch({ type: 'CLEAR' });
        router.push('/products');
      });
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className='grid grid-cols-12 gap-3 mt-5'>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
            <InputLabel htmlFor="name">Tên Sách</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="name"
              required
              placeholder='Tên Sách...'
              value={formState.name}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'name', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
            <InputLabel htmlFor="slug">Đường Dẫn</InputLabel>
            <TextField
              className='w-full bg-gray-200 text-gray-600 rounded'
              size='small'
              id="slug"
              placeholder='ten-sach'
              value={formState.slug}
              disabled
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
            <InputLabel htmlFor="sku">Mã SKU</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="sku"
              required
              placeholder='Mã SKU...'
              value={formState.sku}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'sku', value: e.target.value })}
            />
          </div>
          {
            formState.images.length > 0 ?
              <div className='col-span-12 space-y-2'>
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
                multiple={true}
                handleUpdate={onImageUpdate}
                className='col-span-12 space-y-2' />
          }
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="price">Giá</InputLabel>
            <TextField
              className='w-full'
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>
              }}
              size='small'
              id="price"
              type='number'
              required
              placeholder='Giá Của Sách...'
              value={formState.price}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'price', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="sale">Giảm Giá</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="sale"
              type='number'
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>
              }}
              placeholder='Giảm Giá...'
              value={formState.salePrice}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'salePrice', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="quantity">Số Lượng</InputLabel>
            <TextField
              className='w-full'
              size='small'
              type='number'
              id="quantity"
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">item{formState.quantity > 1 && <span>s</span>}</InputAdornment>
              }}
              placeholder='Số Lượng Trong Giỏ Hàng...'
              value={formState.quantity}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'quantity', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor='discount'>Giảm Giá?</InputLabel>
            <div className="flex gap-2 items-center">
              <Checkbox
                id='discount'
                checked={formState.isSale}
                onChange={(e) => formDispatch({ type: 'CHANGE', field: 'isSale', value: e.target.checked })}
              />
              <span>Sách sẽ được giảm giá khi chọn!</span>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor='freeship'>Miễn Phí Giao Hàng?</InputLabel>
            <div className="flex gap-2 items-center">
              <Checkbox
                id='freeship'
                checked={formState.attributes.find((attr: any) => attr.k === 'free-shipping')?.v || ''}
                onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'free-shipping', value: e.target.value })}

              />
              <span>Sách sẽ được miễn phí giao hàng!</span>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor='Refund'>Cho Phép Trả Hàng?</InputLabel>
            <div className="flex gap-2 items-center">
              <Checkbox
                id='Refund'
                checked={formState.attributes.find((attr: any) => attr.k === 'refund')?.v || ''}
                onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'refund', value: e.target.value })}

              />
              <span>Sách sẽ được hoàn trả!</span>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="page-length">Số Lượng Trang</InputLabel>
            <TextField
              className='w-full'
              size='small'
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">trang</InputAdornment>
              }}
              id="page-length"
              type='number'
              placeholder='Page Length of Product'
              value={formState.attributes.find((attr: any) => attr.k === 'page-length')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'page-length', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="width">Rộng</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="width"
              required
              type='number'
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>
              }}
              placeholder='Width of Product'
              value={formState.attributes.find((attr: any) => attr.k === 'width')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'width', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="length">Dày</InputLabel>
            <TextField
              className='w-full'
              size='small'
              required
              id="length"
              type='number'
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>
              }}
              placeholder='Length of Product'
              value={formState.attributes.find((attr: any) => attr.k === 'length')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'length', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="height">Dài</InputLabel>
            <TextField
              className='w-full'
              size='small'
              required
              id="height"
              type='number'
              InputProps={{
                endAdornment: <InputAdornment position="end">cm</InputAdornment>
              }}
              placeholder='Height of Product'
              value={formState.attributes.find((attr: any) => attr.k === 'height')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'height', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="language">Ngôn Ngữ</InputLabel>
            <Select
              className='w-full'
              size='small'
              id="language"
              value={formState.attributes.find((attr: any) => attr.k === 'language')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'language', value: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value='en'>English</MenuItem>
              <MenuItem value='vi'>Tiếng Việt</MenuItem>
            </Select>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="cover">Bìa</InputLabel>
            <Select
              className='w-full'
              size='small'
              id="cover"
              value={formState.attributes.find((attr: any) => attr.k === 'cover')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'cover', value: e.target.value })}
            >
              <MenuItem value="">
                <em>Không Chọn</em>
              </MenuItem>
              <MenuItem value='hard-cover'>Bìa Cứng</MenuItem>
              <MenuItem value='soft-cover'>Bìa Mềm</MenuItem>
              <MenuItem value='pdf'>Bản PDF</MenuItem>
            </Select>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 space-y-2'>
            <InputLabel htmlFor='description'>Chi Tiết</InputLabel>
            <div style={{ height: 300 }}>
              <div ref={descRef} />
            </div>

          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 space-y-2'>
            <InputLabel htmlFor='about'>Thông Tin</InputLabel>
            <div style={{ height: 300 }}>
              <div ref={aboutRef} />
            </div>
          </div>
        </div>
        <div className='flex justify-end mt-5 gap-2'>
          <Link href='/products'>
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