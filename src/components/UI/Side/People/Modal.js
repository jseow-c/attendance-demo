import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import UISideCollectionFormAdd from "./Form/Add";
import UISideCollectionFormDelete from "./Form/Delete";
import { modalVariant } from "../../variants";

const UISideCollectionModal = ({
  modal,
  modalItem,
  modalLoad,
  modalType,
  closeModal
}) => {
  return (
    <motion.div
      initial="hidden"
      animate={modal ? "visible" : "hidden"}
      variants={modalVariant}
      className="card-modal"
    >
      <AnimatePresence>
        {modalLoad && modalType === "add" && (
          <UISideCollectionFormAdd closeModal={closeModal} />
        )}
        {modalLoad && modalType === "delete" && (
          <UISideCollectionFormDelete
            closeModal={closeModal}
            deleteItem={modalItem}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UISideCollectionModal;
