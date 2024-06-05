'use client'
import { Dialog, DialogPanel, Tab, TabGroup, TabList, TabPanel, TabPanels, Transition, TransitionChild } from '@headlessui/react'
import { useState } from 'react'
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { InputLabel } from '@mui/material';
import { Laptop, Public } from '@mui/icons-material';
import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/solid';
import { toBase64Async } from '@/services/utils/file.util';
import axios from 'axios';

const categories = [
    {
        name: 'Local',
        icon: Laptop
    },
    {
        name: 'Internet',
        icon: Public
    }
]

interface IImage{
    url: string 
    alt: string
}

export default function ImageModal(props: { className?: string }) {
    let [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState([] as IImage[])
   
    const onImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: IImage[] = await Promise.all(Array.from(files).map(async file => ({
                url: await toBase64Async(file),
                alt: file.name
            })));
            setImages(prevImages => [...prevImages, ...newImages]);
        }
    };

    const removeImage = (index:number) => {
        const newImages: IImage[] = images.filter((image, i: number) => i !== index)
        setImages(newImages)
    }

    const onUpload = () => {
        axios.post('/api/v1/images',images)
            .then(res => {
                console.log(res.data)
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setIsOpen(false)
                setImages([])
            })
    }

    const ImagePreview = ({images}:{images:IImage[]}) => {
        return(
            <div className="flex gap-2 p-4 flex-wrap">
                {
                    images.map((image, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <Image
                                alt={image.alt}
                                src={image.url}
                                layout="fill"
                                objectFit="cover"
                            />
                            <div className="absolute inset-0 flex items-start justify-end bg-black/30">
                                <button
                                    onClick={() => removeImage(index)}
                                >
                                    <TrashIcon className="size-5 text-red-600 mt-1 mr-1" />
                                </button>
                            </div>
                        </div>
                    ))
                }
                <label htmlFor="more"
                    className='flex items-center justify-center w-20 h-20 rounded-lg overflow-hidden'>
                    <input
                        multiple
                        onChange={onImagesChange}
                        accept='image/*'
                        id="more"
                        type="file"
                        className="hidden" />
                    <PlusIcon className='w-8 h-8 text-gray-500 dark:text-gray-400' />
                </label>
            </div>
        )
    }

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
                    multiple
                    accept='image/*'
                    id="dropzone-file"
                    type="file"
                    className="hidden" />
            </label>
        </div>
    )

    return (
        <div className={props.className}>
            <InputLabel
                size='normal'
                htmlFor="upload-image"
            >Upload image</InputLabel>
            <Button
                onClick={() => setIsOpen(true)}
                component="label"
                role={undefined}
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
                                        <div className='flex-auto'>
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
                                                    {
                                                        images.length === 0 ?
                                                        <Upload />
                                                        :
                                                        <ImagePreview images={images}/>

                                                    }
                                                    </TabPanel>
                                                    
                                                    <TabPanel className="rounded-xl bg-black/5">

                                                        <div className="flex items-center justify-center w-full">
                                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                                    </svg>
                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                                </div>
                                                                <input id="dropzone-file" type="file" className="hidden" />
                                                            </label>
                                                        </div>

                                                    </TabPanel>
                                                </TabPanels>
                                                <div className="border-t">
                                                    <div className="flex justify-end p-3 gap-3">
                                                        <Button
                                                            onClick={() => setIsOpen(false)}
                                                            variant="outlined"
                                                        >
                                                            Close
                                                        </Button>
                                                        <Button
                                                            disabled={images.length === 0}
                                                            onClick={onUpload}
                                                            variant="contained"
                                                        >
                                                            Save
                                                        </Button>
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
        </div>
    )
}
