import React from "react";

const UIMerakiModalField = ({ name, status, value, onChange }) => {
  return (
    <div className="field">
      <label className="label">{name}</label>
      <div className="control has-icons-right">
        <input
          className={`input ${status ? "is-danger" : "is-secondary"}`}
          type="text"
          placeholder={name}
          value={value}
          onChange={onChange}
        />
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

export default UIMerakiModalField;
