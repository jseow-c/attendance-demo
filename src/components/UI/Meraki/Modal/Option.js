import React from "react";

const classes = {
  active: "tag clickable is-primary",
  notActive: "tag clickable is-white"
};

const UIMerakiModalOptionTitle = ({ name, checkNav, onClick }) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <span className={checkNav(name)} onClick={() => onClick(name)}>
      {capitalizedName}
    </span>
  );
};

const UIMerakiModalOption = ({ option, setOption }) => {
  const checkNav = name =>
    option === name ? classes.active : classes.notActive;
  const onClick = name => {
    setOption(name);
  };
  const titleProps = { checkNav, onClick };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "10px 0 35px 0"
      }}
    >
      <div className="tags has-addons">
        <UIMerakiModalOptionTitle {...titleProps} name="existing" />
        <UIMerakiModalOptionTitle {...titleProps} name="new" />
      </div>
    </div>
  );
};

export default UIMerakiModalOption;
