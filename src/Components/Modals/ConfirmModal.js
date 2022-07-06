import {Dialog} from "@headlessui/react";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import React from "react";
import ModalWrapper from "./ModalWrapper";
import {CheckIcon} from "@heroicons/react/solid";

export default NiceModal.create(({ title, message, action, onAction }) => {
  const modal = useModal();

  return (
    <>
      <ModalWrapper
        visible={modal.visible}
        hideModal={() => {
          modal.hide();
        }}
      >
        <Dialog.Panel className="relative bg-white rounded-lg p-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <CheckIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm hover:scale-105 hover:shadow-md transition-all"
              onClick={() => {
                onAction();
                modal.hide();
              }}
            >
              {action}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm hover:scale-105 hover:shadow-md transition-all"
              onClick={() => modal.hide()}
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </ModalWrapper>
    </>
  );
});
