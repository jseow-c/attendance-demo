import React, { useContext } from "react";
import { StoreContext } from "../../../../context";
import { motion } from "framer-motion";
import { listVariants, cardVariant } from "../../variants";
import UISideCollectionCard from "./Card";

const UISideCollectionList = ({
  openModal,
  enableDelete,
  setModalItem,
  setNav
}) => {
  const {
    collectionStore: [, setCollection],
    collectionListStore: [collectionList]
  } = useContext(StoreContext);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className="collection-container-list"
    >
      <motion.div variants={cardVariant} className="collection-container">
        <div
          className="card card-collection has-background-white-ter card-add"
          onClick={() => openModal("add")}
        >
          <div className="content">
            <div className="icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <div className="title">Add new collection</div>
          </div>
        </div>
      </motion.div>
      {collectionList.map(item => (
        <UISideCollectionCard
          key={item.id}
          item={item}
          cardVariant={cardVariant}
          enableDelete={enableDelete}
          clickSelect={() => {
            setCollection(item);
            setNav("People");
          }}
          clickDelete={() => {
            setModalItem(item);
            openModal("delete");
          }}
        />
      ))}
    </motion.div>
  );
};

export default UISideCollectionList;
