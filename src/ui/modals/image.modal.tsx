'use client'
import { useRef, useState } from 'react';
import { Dialog, DialogPanel, Switch, Tab, TabGroup, TabList, TabPanel, TabPanels, Transition, TransitionChild } from '@headlessui/react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { InputLabel, TextField } from '@mui/material';
import { Laptop, Public } from '@mui/icons-material';
import Image from 'next/image';
import { PlusIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/20/solid';
import { toBase64Async, toBase64Image } from '@/services/utils/file.util';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import type { PutBlobResult } from '@vercel/blob';

const categories = [
  { name: 'Local', icon: Laptop },
  { name: 'Internet', icon: Public }
];

interface IImage {
  id: string;
  url: string;
  alt: string;
}

export default function ImageModal({ multiple = true, className, handleUpdate }: { multiple: boolean, className?: string, handleUpdate?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<IImage[]>([]);
  const [filesUpload, setFilesUpload] = useState<File[]>([]);
  const [isBase64, setIsBase64] = useState(false);
  const [uri, setUri] = useState('');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const onImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!multiple) {
      setImages([]);
    }

    const files = e.target.files;
    if (files) {
      if (multiple) {
        const newImages = await Promise.all(Array.from(files).map(async file => ({
          id: uuidv4(),
          url: await toBase64Async(file),
          alt: file.name
        })));
        setImages(prevImages => [...prevImages, ...newImages]);
        setFilesUpload(prevFiles => [...prevFiles, ...Array.from(files)]);
      } else {
        const file = files[0];
        const newImage: IImage = {
          id: uuidv4(),
          url: await toBase64Async(file),
          alt: file.name
        };
        setImages([newImage]);
        setFilesUpload([file]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const onUpload = async () => {
    setLoading(true);
    try {
      if (!isBase64) {
        const uploadPromises = filesUpload.map(async (file, index) => {

          const response = await axios.post(`/api/v1/images/upload?filename=${file.name}`, file);
          const img = images[index];
          img.url = response.data.data.url;
          setImages(prevImages => [...prevImages, img]);
          return response;
        });
        await Promise.all(uploadPromises);
        setFilesUpload([]);
      }

      const response = await axios.post('/api/v1/images', images);
      if (response.status === 201 && handleUpdate) {
        handleUpdate(response.data.data);
      }

      setIsOpen(false);
      setImages([]);
    } catch (error) {
      console.error("Error uploading images: ", error);
    } finally {
      setLoading(false);
    }
  };

  const onUrlUpload = async () => {
    try {
      const base64 = await toBase64Image(uri);
      if (base64) {
        setImages(prevImages => [...prevImages, {
          id: uuidv4(),
          url: base64,
          alt: 'image'
        }]);
      }
      setUri('');
    } catch (error) {
      console.error("Error converting URL to base64: ", error);
    }
  };

  const ImagePreview = ({ images }: { images: IImage[] }) => (
    <div className="flex gap-2 p-4 flex-wrap">
      {images.map((image, index) => (
        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
          <Image alt={image.alt} src={image.url} layout="fill" objectFit="cover" />
          <div className="absolute inset-0 flex items-start justify-end bg-black/30">
            <button onClick={() => removeImage(index)}>
              <TrashIcon className="size-5 text-red-600 mt-1 mr-1" />
            </button>
          </div>
        </div>
      ))}
      <label htmlFor="more" className="flex items-center justify-center w-20 h-20 rounded-lg overflow-hidden">
        <input multiple onChange={onImagesChange} accept="image/*" id="more" type="file" className="hidden" />
        <PlusIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
      </label>
    </div>
  );

  const Upload = () => (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <input 
        onChange={onImagesChange} 
        ref={inputFileRef}
        multiple 
        accept="image/*" 
        id="dropzone-file"
        type="file" 
        className="hidden" />
      </label>
    </div>
  );

  return (
    <div className={className}>
      <InputLabel size="normal" htmlFor="upload-image">Upload image</InputLabel>
      <Button
        onClick={() => setIsOpen(true)}
        component="label"
        role={undefined}
        color="inherit"
        variant="outlined"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload image
      </Button>
      <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 z-50 w-screen overflow-y-auto bg-blue-600/20">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-xl rounded-xl bg-white backdrop-blur-2xl">
                  <div className="flex w-full justify-center">
                    <div className="flex-auto">
                      <TabGroup>
                        <TabList className="flex gap-4 border-b px-4 py-2">
                          {categories.map(({ name, icon }) => (
                            <Tab
                              key={name}
                              className="rounded py-1 px-3 text-sm/6 font-semibold text-gray-950 focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
                            >
                              <div className="flex flex-col justify-between">
                                <span>{name}</span>
                              </div>
                            </Tab>
                          ))}
                        </TabList>
                        <TabPanels className="p-3 max-w-xl">
                          <TabPanel className="rounded-xl bg-black/5 min-h-72">
                            {images.length === 0 ? <Upload /> : <ImagePreview images={images} />}
                          </TabPanel>

                          <TabPanel className="rounded-xl bg-black/5">
                            <>
                              <div className="flex gap-2 p-2">
                                <TextField
                                  type="text"
                                  value={uri}
                                  onChange={(e) => setUri(e.target.value)}
                                  label="Image URL"
                                  className="w-full bg-white"
                                  size="small"
                                />
                                <Button type="button" onClick={onUrlUpload}>Search</Button>
                              </div>
                              <ImagePreview images={images} />
                            </>
                          </TabPanel>
                        </TabPanels>
                        <div className="border-t flex justify-between items-center p-3">
                          <div className='flex gap-2 items-center'>
                            <Switch
                              disabled={true}
                              checked={isBase64}
                              onChange={() => setIsBase64(!isBase64)}
                              className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-red-600/30 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-600/30"
                            >
                              <span
                                aria-hidden="true"
                                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                              />
                            </Switch>
                            <span className='text-sm text-gray-600'>Up load with base64</span>
                          </div>
                          <div className="flex gap-3">
                            <Button onClick={() => setIsOpen(false)} variant="outlined">Close</Button>
                            <Button disabled={images.length === 0} onClick={onUpload} variant="contained">Save</Button>
                          </div>
                        </div>
                      </TabGroup>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex items-center justify-center p-4 bg-white rounded-xl">
            <ArrowPathIcon className="size-20 animate-spin text-blue-600" />
          </div>
        </div>
      )}
    </div>
  );
}
