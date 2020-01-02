import React from "react";

const classes = {
  active: "nav-title title-with-subtitles light-bold",
  notActive: "nav-title title-with-subtitles light-bold muted"
};

const UISideNavTitle = ({ name, checkNav, onClick }) => {
  return (
    <h4 className={checkNav(name)} onClick={() => onClick(name)}>
      {name}
    </h4>
  );
};

const UISideNav = ({ nav, setNav }) => {
  const checkNav = name => (nav === name ? classes.active : classes.notActive);
  const onClick = name => setNav(name);
  const titleProps = { checkNav, onClick };
  return (
    <div className="nav">
      <UISideNavTitle {...titleProps} name="Collections" />
      <UISideNavTitle {...titleProps} name="People" />
    </div>
  );
};

export default UISideNav;
