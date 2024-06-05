'use client'
import * as React from 'react';
import ImageModal from '@/ui/modals/image.modal';
import { InputLabel, TextField } from '@mui/material';
import Image from 'next/image';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

export default function ProductFrom() {
  //create reducer for form

  const formReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'CHANGE':
        return {
          ...state,
          [action.field]: action.value,
        };
      default:
        return state;
    }
  };

  const initialState = {
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    sku: '',
    salePrice: 0,
    price: 0,
    isSale: false,
    quantity: 0,
    attributes: {},
    images: [],
    orders: [],
    reviews: [],
    variants: [],
    stockHistories: [],
  };

  const [formState, formDispatch] = React.useReducer(formReducer, initialState);
  //slug watch for name change
  React.useEffect(() => {
    formDispatch({ type: 'CHANGE', field: 'slug', value: formState.name.replace(/\s+/g, '-').toLowerCase() });
  }, [formState.name]);
  return (
    <form>
      <div className='grid grid-cols-12 gap-3 mt-5'>
        <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
          <InputLabel>Name</InputLabel>
          <TextField
            className='w-full'
            size='small'
            id="outlined-required"
            placeholder='Product Name'
            value={formState.name}
            onChange={(e) => formDispatch({ type: 'CHANGE', field: 'name', value: e.target.value })}
          />
        </div>
        <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
          <InputLabel>Slug</InputLabel>
          <TextField
            className='w-full bg-gray-200 text-gray-600 rounded'
            size='small'
            id="outlined-required"
            placeholder='product-name'
            value={formState.slug}
            disabled
          />
        </div>
        <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
          <InputLabel>SKU</InputLabel>
          <TextField
            className='w-full'
            size='small'
            id="outlined-required"
            placeholder='Product SKU'
            value={formState.sku}
            onChange={(e) => formDispatch({ type: 'CHANGE', field: 'sku', value: e.target.value })}
          />
        </div>
        {
          formState.images.length > 0 ?
            <div className='col-span-12 space-y-2'>
              <InputLabel>Images</InputLabel>
              <div className='grid grid-cols-12 gap-2'>
                {
                  formState.images.map((image: any, index: number) => (
                    <div key={index} className='col-span-6'>
                      <Image  
                      width={80}
                      height={80}
                      src={image.url} 
                      alt={image.alt} 
                      className='w-full h-40 object-cover' />
                    </div>
                  ))
                }
              </div>
            </div>

            :
            <ImageModal
              handleUpdate={(images: any) => formDispatch({ type: 'CHANGE', field: 'images', value: images })}
              className='col-span-12 space-y-2' />
        }
        <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
          <InputLabel>Price</InputLabel>
          <TextField
            className='w-full'
            size='small'
            id="outlined-required"
            placeholder='Price of Product'
            value={formState.price}
            onChange={(e) => formDispatch({ type: 'CHANGE', field: 'price', value: e.target.value })}
          />
        </div>
        <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
          <InputLabel>Sale Price</InputLabel>
          <TextField
            className='w-full'
            size='small'
            id="outlined-required"
            placeholder='Price of Product on Sale'
            value={formState.salePrice}
            onChange={(e) => formDispatch({ type: 'CHANGE', field: 'salePrice', value: e.target.value })}
          />
        </div>
        <div className='col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 space-y-2'>
          <InputLabel>Quantity</InputLabel>
          <TextField
            className='w-full'
            size='small'
            id="outlined-required"
            placeholder='Quantity of Product in Stock'
            value={formState.quantity}
            onChange={(e) => formDispatch({ type: 'CHANGE', field: 'quantity', value: e.target.value })}
          />
        </div>
        <div className='col-span-12 lg:col-span-6 space-y-2'>
          <InputLabel htmlFor='description' >Description</InputLabel>
          <TextareaAutosize
            className='w-full border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
            minRows={3}
            id="description"
            placeholder='Product Description'
            value={formState.description}
            onChange={(e) => formDispatch({ type: 'CHANGE', field: 'description', value: e.target.value })}
          />
        </div>
        <div className='col-span-12 lg:col-span-6 space-y-2'>
          <InputLabel htmlFor='short-description' >Description</InputLabel>
          <TextareaAutosize
            className='w-full border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
            minRows={3}
            id="short-description"
            placeholder='Short Description'
            value={formState.shortDescription}
            onChange={(e) => formDispatch({ type: 'CHANGE', field: 'shortDescription', value: e.target.value })}
          />
        </div>
      </div>
    </form>
  )
}