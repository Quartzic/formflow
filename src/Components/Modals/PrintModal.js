import NiceModal, {useModal} from "@ebay/nice-modal-react";
import React from "react";
import ModalWrapper from "./ModalWrapper";
import {Dialog} from "@headlessui/react";
import PrintModalView from "./PrintModalView";

export default NiceModal.create(
  () => {
    const modal = useModal();

    return (
      <>
        <ModalWrapper
          visible={modal.visible}
          hideModal={() => {
            modal.hide();
          }}
        >
          <Dialog.Panel className="relative bg-white rounded-lg p-4 text-left w-full overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:p-6">
            <PrintModalView/>
          </Dialog.Panel>
        </ModalWrapper>
      </>
    );
  }
);
