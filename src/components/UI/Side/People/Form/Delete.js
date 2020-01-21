import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { StoreContext } from "../../../../../context";
import UISidePeopleCard from "../Card";
import { modalChildVariant, cardVariant } from "../../../variants";
import axios from "axios";

const UISidePeopleFormDelete = ({ closeModal, deleteItem }) => {
  const {
    recognitionStore: [recognition],
    collectionStore: [collection],
    peopleStore: [people, setPeople]
  } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const onDelete = async () => {
    setLoading(true);
    const url = `${process.env.REACT_APP_SERVER_IP}/${recognition}/collection/${collection.id}/person/${deleteItem.person_id}`;
    const options = {};
    await axios.delete(url, options);
    setLoading(false);
    const newList = people.slice();
    const deleteIndex = people.findIndex(
      i => i.person_id === deleteItem.person_id
    );
    newList.splice(deleteIndex, 1);
    setPeople(newList);
    closeModal();
  };
  return (
    <motion.div variants={modalChildVariant} exit={modalChildVariant.hidden}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3em"
        }}
      >
        <h3 className="light-bold">Deleting Person</h3>
        <button className="delete is-large" onClick={closeModal}></button>
      </div>
      <div className="field">
        <label className="label">
          Are you sure you would like to delete{" "}
          <div style={{ margin: "1.5vmin 0" }}>
            <div>
              <UISidePeopleCard
                item={deleteItem}
                cardVariant={cardVariant}
                options={false}
              />
            </div>
          </div>
        </label>
        <p className="help is-secondary">
          Please note that this action is irreversible.
        </p>
      </div>
      <div className="control">
        <button
          className={`button is-link is-danger mr-1 ${
            loading ? "is-loading" : ""
          }`}
          onClick={onDelete}
        >
          Yes
        </button>
        <button className="button is-link" onClick={closeModal}>
          No
        </button>
      </div>
    </motion.div>
  );
};

export default UISidePeopleFormDelete;
