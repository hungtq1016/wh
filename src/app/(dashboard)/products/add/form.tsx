'use client'
import * as React from 'react';
import ImageModal from '@/ui/modals/image.modal';
import { InputLabel, TextField } from '@mui/material';

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
        <div className='col-span-12 md:col-span-10 lg:col-span-8 xl:col-span-6 space-y-2'>
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
        <div className='col-span-12 md:col-span-10 lg:col-span-8 xl:col-span-6 space-y-2'>
          <InputLabel>Slug</InputLabel>
          <TextField
            className='w-full'
            size='small'
            id="outlined-required"
            placeholder='product-name'
            value={formState.slug}
            disabled
          />
        </div>
        <ImageModal className='col-span-12 md:col-span-10 lg:col-span-8 xl:col-span-6 space-y-2'/>

      </div>
    </form>
  )
}