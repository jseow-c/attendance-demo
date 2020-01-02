import React, { useContext } from "react";
import UIMerakiForm from "./Form/Form";
import { StoreContext } from "../../../context";

const classes = {
  active: "nav-title title-with-subtitles light-bold",
  notActive: "nav-title title-with-subtitles light-bold muted"
};

const UIMeraki = () => {
  const {
    collectionStore: [collection]
  } = useContext(StoreContext);
  const collectionExist = Object.keys(collection).length > 0;

  return (
    <div className="card card-register">
      <div className="card-content" style={{ height: "100%" }}>
        <div className="nav">
          <h4 className={collectionExist ? classes.active : classes.notActive}>
            Meraki Camera
          </h4>
        </div>
        <div className="main-content">
          {collectionExist && <UIMerakiForm />}
          {!collectionExist && (
            <div
              style={{
                display: "flex",
                height: "50vmin",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              No collection selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UIMeraki;