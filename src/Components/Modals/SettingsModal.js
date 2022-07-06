import {Dialog} from "@headlessui/react";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import React from "react";
import ModalWrapper from "./ModalWrapper";
import {useDispatch, useSelector} from "react-redux";
import settingsSlice from "../../Redux/settingsSlice";

function SettingsItem(props) {
    return <div className="rounded-md bg-gray-50 px-6 py-5 flex items-start sm:justify-between">
        <div className="flex items-start ">
            <div className="mt-0">
                <div className="text-sm font-medium text-gray-900">{props.title}</div>
                <div className="mt-1 text-xs text-gray-600">
                    <div>{props.value ?? "Not set"}</div>
                </div>
            </div>
        </div>
        <div className="mt-0 ml-6 flex-shrink-0">
            <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                onClick={props.onClick}
            >
                Edit
            </button>
        </div>
    </div>;
}

export default NiceModal.create(() => {
  const modal = useModal();
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  return (
    <>
        <ModalWrapper
            visible={modal.visible}
            hideModal={() => {
                modal.hide();
            }}
        >
            <Dialog.Panel
                className="relative bg-white rounded-lg p-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full sm:p-6">

                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                    >
                        Settings
                    </Dialog.Title>
                    <div className="mt-2">
                        <div className="mt-5 space-y-4">
                            <SettingsItem title={"Barcode Save Location"} value={settings.barcodeSaveLocation} onClick={async () => {
                                let location = await window.electronAPI.selectFolder();
                                if (location) {
                                    dispatch(settingsSlice.actions.set({
                                        ...settings,
                                        barcodeSaveLocation: location
                                    }));
                                }
                            }}/>
                            <SettingsItem title={"Workflow Save Location"} value={settings.workflowSaveLocation} onClick={async () => {
                                let location = await window.electronAPI.selectFolder();
                                if (location) {
                                    dispatch(settingsSlice.actions.set({
                                        ...settings,
                                        workflowSaveLocation: location
                                    }));
                                }
                            }}/>
                        </div>
                    </div>
                </div>
                {/*
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm hover:scale-105 hover:shadow-md transition-all"
              onClick={() => {
                modal.hide();
              }}
            >
              Action
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm hover:scale-105 hover:shadow-md transition-all"
              onClick={() => modal.hide()}
            >
              Cancel
            </button>
          </div>*/}
            </Dialog.Panel>
        </ModalWrapper>
    </>
  );
});
