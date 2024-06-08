'use client'
import * as React from 'react';
import ImageModal from '@/ui/modals/image.modal';
import { Button, Checkbox, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Image from 'next/image';
import { slugify } from '@/services/utils/string.util';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Switch } from '@headlessui/react';

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

const getData = async (route: string) => {
  const response = await axios.get(route)
  return response.data.data || []
}

export default function ProductFrom() {
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
      case 'CHANGE_ATTRIBUTE':
        state.attributes = state.attributes.filter((attr: any) => attr.k !== action.field);
        return {
          ...state,
          attributes: [...state.attributes, { k: action.field, v: action.value }]
        }
      default:
        return state;
    }
  };

  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  const [loading, setLoading] = React.useState(false);
  
  React.useEffect(() => {
    getData("/api/v1/products/id/"+id).then((res) => {
      formDispatch({ type: 'UPDATE', data: res })
    })
  }, [id])

  React.useEffect(() => {
    formDispatch({ type: 'CHANGE', field: 'slug', value: slugify(formState.name) });
  }, [formState.name]);

  const onImageUpdate = (images: any) => {
    formDispatch({ type: 'CHANGE', field: 'images', value: images });
  }

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
    axios.put(`/api/v1/products/id/${id}`, formState)
      .then((res) => {
        toast.success('Product updated successfully!');
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
          <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
            <InputLabel htmlFor="name">Name</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="name"
              required
              placeholder='Product Name'
              value={formState.name}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'name', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
            <InputLabel htmlFor="name">Slug</InputLabel>
            <TextField
              className='w-full bg-gray-200 text-gray-600 rounded'
              size='small'
              id="slug"
              placeholder='product-name'
              value={formState.slug}
              disabled
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
            <InputLabel htmlFor="sku">SKU</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="sku"
              required
              placeholder='Product SKU'
              value={formState.sku}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'sku', value: e.target.value })}
            />
          </div>
          {
            formState.images.length > 0 ?
              <div className='col-span-12 space-y-2'>
                <InputLabel>Images</InputLabel>
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
                handleUpdate={onImageUpdate}
                className='col-span-12 space-y-2' />
          }
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="price">Price</InputLabel>
            <TextField
              className='w-full'
              InputProps={{
                endAdornment:<InputAdornment position="end">đ</InputAdornment>
              }}
              size='small'
              id="price"
              type='number'
              required
              placeholder='Price of Product'
              value={formState.price}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'price', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="sale">Sale Price</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="sale"
              type='number'
              required
              InputProps={{
                endAdornment:<InputAdornment position="end">đ</InputAdornment>
              }}
              placeholder='Price of Product on Sale'
              value={formState.salePrice}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'salePrice', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="quantity">Quantity</InputLabel>
            <TextField
              className='w-full'
              size='small'
              type='number'
              id="quantity"
              required
              InputProps={{
                endAdornment:<InputAdornment position="end">item{formState.quantity>1 && <span>s</span>}</InputAdornment>
              }}
              placeholder='Quantity of Product in Stock'
              value={formState.quantity}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'quantity', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor='discount'>Discount</InputLabel>
            <div className="flex gap-2 items-center">
              <div className="basis-14">
              <Switch
                checked={formState.isSale}
                onChange={(e) => formDispatch({ type: 'CHANGE', field: 'isSale', value: e })}
                className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-red-600/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-600/10"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                />
              </Switch>
              </div>
              <span>This product will sale with discount price!</span>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor='freeship'>Free shipping</InputLabel>
            <div className="flex gap-2 items-center">
              <div className="basis-14">
                <Switch
                  checked={formState.attributes.find((attr: any) => attr.k === 'free-shipping')?.v || false}
                  onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'free-shipping', value: e })}
                  className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-red-600/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-600/10"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                  />
                </Switch>
              </div>
              <span>The free shipping program will be applied!</span>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor='Refund'>Refund</InputLabel>
            <div className="flex gap-2 items-center">
              <div className="basis-14">
                <Switch
                  checked={formState.attributes.find((attr: any) => attr.k === 'refund')?.v || false}
                  onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'refund', value: e })}
                  className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-red-600/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-600/10"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                  />
                </Switch>
              </div>
              <span>This product will be eligible for refund!</span>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="page-length">Page Length</InputLabel>
            <TextField
              className='w-full'
              size='small'
              required
              InputProps={{
                endAdornment:<InputAdornment position="end">pages</InputAdornment>
              }}
              id="page-length"
              type='number'
              placeholder='Page Length of Product'
              value={formState.attributes.find((attr: any) => attr.k === 'page-length')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'page-length', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="width">Width</InputLabel>
            <TextField
              className='w-full'
              size='small'
              id="width"
              required
              type='number'
              InputProps={{
                endAdornment:<InputAdornment position="end">cm</InputAdornment>
              }}
              placeholder='Width of Product'
              value={formState.attributes.find((attr: any) => attr.k === 'width')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'width', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="length">Length</InputLabel>
            <TextField
              className='w-full'
              size='small'
              required
              id="length"
              type='number'
              InputProps={{
                endAdornment:<InputAdornment position="end">cm</InputAdornment>
              }}
              placeholder='Length of Product'
              value={formState.attributes.find((attr: any) => attr.k === 'length')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'length', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="height">Height</InputLabel>
            <TextField
              className='w-full'
              size='small'
              required
              id="height"
              type='number'
              InputProps={{
                endAdornment:<InputAdornment position="end">cm</InputAdornment>
              }}
              placeholder='Height of Product'
              value={formState.attributes.find((attr: any) => attr.k === 'height')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'height', value: e.target.value })}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2 space-y-2'>
            <InputLabel htmlFor="language">Language</InputLabel>
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
            <InputLabel htmlFor="cover">Cover</InputLabel>
            <Select
              className='w-full'
              size='small'
              id="cover"
              value={formState.attributes.find((attr: any) => attr.k === 'cover')?.v || ''}
              onChange={(e) => formDispatch({ type: 'CHANGE_ATTRIBUTE', field: 'cover', value: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value='hard-cover'>Hard Cover</MenuItem>
              <MenuItem value='soft-cover'>Soft Cover</MenuItem>
              <MenuItem value='pdf'>PDF</MenuItem>
            </Select>
          </div>
          {/* <div className='col-span-12 md:col-span-6 lg:col-span-6 space-y-2'>
            <InputLabel htmlFor='description' >Description</InputLabel>
            <TextareaAutosize
              className='w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-900'
              minRows={16}
              required
              id="description"
              placeholder='Product Description'
              value={formState.description}
              onChange={(e) => formDispatch({ type: 'CHANGE', field: 'description', value: e.target.value })}
            />
          </div> */}
          <div className='col-span-12 md:col-span-6 lg:col-span-6 space-y-2'>
            <InputLabel htmlFor='description'>Description</InputLabel>
            <Editor
              apiKey='djw4c7uq7gsbbh61pf3lb9ysv0rtt0rq159cg1mzs8xkarpy'
              id='description'
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
              value={formState.description}
              onEditorChange={(content, editor) => {
                formDispatch({ type: 'CHANGE', field: 'description', value: content });
              }}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-6 space-y-2'>
            <InputLabel htmlFor='about'>About</InputLabel>
            <Editor
              apiKey='djw4c7uq7gsbbh61pf3lb9ysv0rtt0rq159cg1mzs8xkarpy'
              id='about'
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
              value={formState.about}
              onEditorChange={(content, editor) => {
                formDispatch({ type: 'CHANGE', field: 'about', value: content });
              }}
            />
          </div>
        </div>
        <div className='flex justify-end mt-5 gap-2'>
          <Link href='/products'>
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