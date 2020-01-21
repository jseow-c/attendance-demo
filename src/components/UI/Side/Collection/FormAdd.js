import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { StoreContext } from "../../../../context";
import { modalChildVariant } from "../../variants";
import { isAlphaNumeric, isLowerCase } from "../../../../functions/validation";

import axios from "axios";

const UISideCollectionFormAdd = ({ closeModal }) => {
  const {
    recognitionStore: [recognition],
    collectionListStore: [collectionList, setCollectionList]
  } = useContext(StoreContext);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("This name is too short.");

  const onChange = e => {
    const newName = e.target.value;
    const newId = `${newName}Id`;

    // set change to state
    setName(newName);

    // check if name is taken
    const checkList = collectionList.filter(
      item => item.id === newId || item.name === newName
    );
    if (checkList.length > 0) {
      setStatus("This name is unavailable.");
    } else {
      if (newName.length < 3) {
        setStatus("This name is too short.");
      } else if (newName.length > 10) {
        setStatus("This name is too long");
      } else if (recognition === "intercorp" && !isAlphaNumeric(newName)) {
        setStatus("This name accepts only alphanumeric.");
      } else if (recognition === "aws" && !isLowerCase(newName)) {
        setStatus("This name accepts only lowercase and numbers.");
      } else {
        setStatus("");
      }
    }
  };

  const onSubmit = async () => {
    if (!status) {
      setLoading(true);
      const url = `${process.env.REACT_APP_SERVER_IP}/${recognition}/collection`;
      const options = { "Content-Type": "application/json" };
      const postData = {
        name
      };
      const response = await axios.post(url, postData, options);
      setLoading(false);
      setCollectionList(collectionList.concat([response.data]));
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
        <h3 className="light-bold">New Collection</h3>
        <button className="delete is-large" onClick={closeModal}></button>
      </div>
      <div className="field">
        <label className="label">Collection Name</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className={`input ${status ? "is-danger" : "is-secondary"}`}
            type="text"
            placeholder="Text input"
            value={name}
            onChange={onChange}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-book"></i>
          </span>
          <span className="icon is-small is-right">
            <i
              className={`fas ${
                status ? "fa-exclamation-triangle" : "fa-check"
              }`}
            ></i>
          </span>
        </div>
        <p className={`help ${status ? "is-danger" : "is-secondary"}`}>
          {status ? status : "This name is available."}
        </p>
      </div>
      <div className="control" onClick={onSubmit}>
        <button
          className={`button is-link ${loading ? "is-loading" : ""}`}
          disabled={status ? true : false}
        >
          Submit
        </button>
      </div>
    </motion.div>
  );
};

export default UISideCollectionFormAdd;
