import React, { useContext } from "react";
import { StoreContext } from "../../../../context";
import { motion } from "framer-motion";
import { listVariants, cardVariant } from "../../variants";
import UISidePeopleCard from "./Card";

const UISidePeopleList = ({ openModal, enableDelete, setModalItem }) => {
  const {
    peopleStore: [people]
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
            <div className="title">Add new person</div>
          </div>
        </div>
      </motion.div>
      {people.map(item => (
        <UISidePeopleCard
          key={item.person_id}
          item={item}
          cardVariant={cardVariant}
          enableDelete={enableDelete}
          clickDelete={() => {
            setModalItem(item);
            openModal("delete");
          }}
        />
      ))}
    </motion.div>
  );
};

export default UISidePeopleList;
