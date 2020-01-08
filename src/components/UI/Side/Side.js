import React, { useContext } from "react";
import UISideNav from "./Nav";
import UISideFR from "./FR";
import UISidePeople from "./People/People";
import UISideCollection from "./Collection/Collection";
import { StoreContext } from "../../../context";

const UISide = () => {
  const {
    navStore: [nav, setNav]
  } = useContext(StoreContext);
  return (
    <div className="card card-register has-background-light">
      <div className="card-content" style={{ height: "100%" }}>
        <UISideNav nav={nav} setNav={setNav} />
        <UISideFR />
        <div className="main-content" style={{ padding: 0 }}>
          {nav === "Collections" && <UISideCollection setNav={setNav} />}
          {nav === "People" && <UISidePeople setNav={setNav} />}
        </div>
      </div>
    </div>
  );
};

export default UISide;
