import React, { useState } from "react";
import UISideNav from "./Nav";
import UISidePeople from "./People/People";
import UISideCollection from "./Collection/Collection";

const UISide = () => {
  const [nav, setNav] = useState("Collections");
  return (
    <div className="card card-register has-background-light">
      <div className="card-content" style={{ height: "100%" }}>
        <UISideNav nav={nav} setNav={setNav} />
        <div className="main-content">
          {nav === "Collections" && <UISideCollection setNav={setNav} />}
          {nav === "People" && <UISidePeople setNav={setNav} />}
        </div>
      </div>
    </div>
  );
};

export default UISide;
