import React from 'react';
import {ExclamationIcon} from "@heroicons/react/solid";
import {useSelector} from "react-redux";
import {Transition} from '@headlessui/react'

function ConnectionStatus() {

        const databaseQueue = useSelector((state) => state.databaseQueue);
        return <Transition
            show={databaseQueue.length > 0}
            enter="transition-opacity duration-250 ease-in-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-250 ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >

            <div className={"fixed mt-2 flex w-full justify-center"}>
            <div className="fixed w-1/2 shadow-md rounded-md bg-yellow-50 p-2">
                <div className="flex justify-center">
                    <div className="flex-shrink-0">
                        <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <div className="text-sm text-yellow-700">
                            <p>
                                There are {databaseQueue.length} submissions queued for upload. Connect this device to the Internet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </Transition>
}

export default ConnectionStatus;