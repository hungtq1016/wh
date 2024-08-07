'use client'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import CollectionFrom from "./form"
import CollectionExhibition from "./exhibition"

const categories = ['Thông Tin','Hiện Vật']
export default function Swap({collectionId}:{collectionId:string}) {
    return (
        <TabGroup>
            <TabList className="flex gap-4 border-b px-4 py-2">
                {categories.map((name) => (
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
            <TabPanels>
                <TabPanel >
                    <CollectionFrom />
                </TabPanel>
                <TabPanel>
                    <CollectionExhibition collectionId={collectionId}/>
                </TabPanel>
            </TabPanels>
        </TabGroup>
    )
}