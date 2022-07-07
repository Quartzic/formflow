import NiceModal, {useModal} from "@ebay/nice-modal-react";
import React from "react";
import ModalWrapper from "./ModalWrapper";
import {Dialog} from "@headlessui/react";
import PrintModalView from "./PrintModalView";
import {useSelector} from "react-redux";

export default NiceModal.create(
  () => {
    const modal = useModal();
    const settings = useSelector((state) => state.settings);

    return (
      <>
        <ModalWrapper
          visible={modal.visible}
          hideModal={() => {
            modal.hide();
          }}
        >
          <Dialog.Panel className="relative bg-white rounded-lg p-4 text-left w-full overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:p-6">
            <PrintModalView location={settings.barcodeSaveLocation}/>
          </Dialog.Panel>
        </ModalWrapper>
      </>
    );
  }
);
