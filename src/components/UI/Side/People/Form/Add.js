import React, { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { StoreContext } from "../../../../../context";
import UISidePeopleFormInput from "./Input";
import UISidePeopleFormImage from "./Image";
import { modalChildVariant } from "../variants";
import { isAlphaNumericSpace } from "../../../../../functions/validation";

const UISidePeopleFormAdd = ({ closeModal }) => {
  const {
    recognitionStore: [recognition],
    peopleStore: [people, setPeople],
    collectionStore: [collection]
  } = useContext(StoreContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("This name is too short.");

  const onChange = e => {
    const newName = e.target.value;
    const newId = `${newName}Id`;

    // set change to state
    setName(newName);

    // check if name is taken
    const checkList = people.filter(
      item => item.id === newId || item.name === newName
    );
    if (checkList.length > 0) {
      setStatus("This name is unavailable.");
    } else {
      if (newName.length < 3) {
        setStatus("This name is too short.");
      } else if (newName.length > 15) {
        setStatus("This name is too long");
      } else if (!isAlphaNumericSpace(newName)) {
        setStatus("This name accepts only alphanumeric.");
      } else {
        setStatus("");
      }
    }
  };

  const onSubmit = async () => {
    if (!status) {
      setLoading(true);
      const url = `${process.env.REACT_APP_SERVER_IP}/${recognition}/collection/${collection.id}/person`;
      const options = { "Content-Type": "application/json" };
      const postData = { name, image };
      const response = await axios.post(url, postData, options);
      console.log(response.data);
      setPeople(people.concat([response.data]));
      setLoading(false);
      closeModal();
      setTimeout(() => {
        setName("");
        setStatus("This name is too short.");
      }, 500);
    }
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
        <h3 className="light-bold">Enroll Person</h3>
        <button className="delete is-large" onClick={closeModal}></button>
      </div>
      <UISidePeopleFormInput value={name} status={status} onChange={onChange} />
      <UISidePeopleFormImage image={image} setImage={setImage} />
      <div className="control" onClick={onSubmit}>
        <button
          className={`button is-link ${loading ? "is-loading" : ""}`}
          disabled={status || image === null ? true : false}
        >
          Submit
        </button>
      </div>
    </motion.div>
  );
};

export default UISidePeopleFormAdd;
