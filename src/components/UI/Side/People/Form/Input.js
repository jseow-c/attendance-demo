import React from "react";

const UISidePeopleFormInput = ({ value, status, onChange }) => {
  return (
    <div className="field">
      <label className="label">Name</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={`input ${status ? "is-danger" : "is-secondary"}`}
          type="text"
          placeholder="Text input"
          value={value}
          onChange={onChange}
        />
        <span className="icon is-small is-left">
          <i className="fas fa-book"></i>
        </span>
        <span className="icon is-small is-right">
          <i
            className={`fas ${status ? "fa-exclamation-triangle" : "fa-check"}`}
          ></i>
        </span>
      </div>
      <p className={`help ${status ? "is-danger" : "is-secondary"}`}>
        {status ? status : "This name is available."}
      </p>
    </div>
  );
};

export default UISidePeopleFormInput;
