import React, { useState } from "react";

import axios from "axios";

function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)
    ) {
      // lower alpha (a-z)
      return false;
    }
  }
  return true;
}

const UIStartModal = ({ list, setList, hide, setModal }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("This name is too short.");

  const onChange = e => {
    const newName = e.target.value;
    const newId = `${newName}Id`;

    // set change to state
    setName(newName);

    // check if name is taken
    const checkList = list.filter(
      item => item.id === newId || item.name === newName
    );
    if (checkList.length > 0) {
      setStatus("This name is unavailable.");
    } else {
      if (newName.length < 3) {
        setStatus("This name is too short.");
      } else if (newName.length > 10) {
        setStatus("This name is too long");
      } else if (!isAlphaNumeric(newName)) {
        setStatus("This name accepts only alphanumeric.");
      } else {
        setStatus("");
      }
    }
  };

  const onSubmit = async () => {
    if (!status) {
      setLoading(true);
      const url = `${process.env.REACT_APP_SERVER_IP}/intercorp/collection`;
      const options = { "Content-Type": "application/json" };
      const postData = {
        name
      };
      await axios.post(url, postData, options);
      setLoading(false);
      setList(list.concat([{ name, id: `${name}Id` }]));
      setModal(false);
      setTimeout(() => {
        setName("");
        setStatus("This name is too short.");
      }, 500);
    }
  };
  return (
    <div className={`card start-modal ${hide ? "hide" : ""}`}>
      <div className="field">
        <label className="label">Collection Name</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className={`input ${status ? "is-danger" : "is-success"}`}
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
        <p className={`help ${status ? "is-danger" : "is-success"}`}>
          {status ? status : "This name is available."}
        </p>
      </div>
      <div class="control" onClick={onSubmit}>
        <button
          class={`button is-link ${loading ? "is-loading" : ""}`}
          disabled={status ? true : false}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UIStartModal;
