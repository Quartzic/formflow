import React from "react";
import {Combobox, Transition} from '@headlessui/react'
import {SelectorIcon} from "@heroicons/react/solid";
import classNames from "classnames";

let chs_dc2 = require("../Data/CHS-DC2.json");

export const LocationCombobox = ({field, form, ...props}) => {
    let [search, setSearch] = React.useState('');
  let filteredOptions = chs_dc2.filter(option => {
      return option.position.toLowerCase().includes(search.toLowerCase());
  });

  // only show the first 250 options
  filteredOptions = filteredOptions.slice(0, 250);

  return (
      <Combobox value={field.value} onChange={(val) => {
          form.setFieldValue(field.name, val)
      }} >
          {({activeOption}) => (
          <div className="relative mt-1">
          <Combobox.Input onKeyDown={
                (e) => {
                    // if key is tab and there's no active option or value, don't submit the form
                    if(e.key === 'Tab') {
                        if(activeOption){
                            form.setFieldValue(field.name, activeOption).then(() => {
                                props.submitFormIfLast();
                            });
                        }else{
                            props.submitFormIfLast();
                        }
                        e.preventDefault();
                    }
                }
          } onChange={(event) => setSearch(event.target.value)} className={"w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"}/>
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                  />
              </Combobox.Button>


                  <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                  >
              <Combobox.Options className={"absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"}>
                  {filteredOptions.length > 0 && filteredOptions.map((option) => (
                  <Combobox.Option key={option.position} value={option.position} className={({ active }) =>
                      classNames(
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active ? "bg-indigo-600 text-white" : "text-gray-900"
                      )
                  }>
                      {option.position}
                  </Combobox.Option>
              ))}
                  <Combobox.Option value={search} className={({ active }) =>
                      classNames(
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active ? "bg-indigo-600 text-white" : "text-gray-900"
                      )
                  }>
                      Create "{search}"
                  </Combobox.Option>
              </Combobox.Options>
                  </Transition>
          </div>
              )}
      </Combobox>
    );
  }
