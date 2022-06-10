import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React from "react";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import PrintModalView from "./PrintModalView";
import { debug } from "../../Data/SimpleLogger";

export default NiceModal.create(
  ({
    barcodes,
    addBarcode,
    removeBarcode,
    clearAllBarcodes,
    exportBarcodesAsCSV,
  }) => {
    const modal = useModal();

    return (
      <>
        <ModalWrapper
          visible={modal.visible}
          hideModal={() => {
            modal.hide();
            debug("Print modal hidden");
          }}
        >
          <Dialog.Panel className="relative m-4 bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
            <PrintModalView
              barcodes={barcodes}
              addBarcode={addBarcode}
              removeBarcode={removeBarcode}
              clearAllBarcodes={clearAllBarcodes}
              exportBarcodesAsCSV={exportBarcodesAsCSV}
            />
          </Dialog.Panel>
        </ModalWrapper>
      </>
    );
  }
);
