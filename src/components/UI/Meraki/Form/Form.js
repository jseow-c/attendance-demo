import React, { useContext, useState } from "react";
import { StoreContext } from "../../../../context";
import LoadingGif from "../../../../img/loading.gif";
import UIMerakiFormStatic from "./Static";
import UIMerakiFormSense from "./Sense";

const UIMerakiForm = ({ openModal }) => {
  const {
    merakiStore: [meraki],
    collectionStore: [collection],
    cameraTypeStore: [cameraType]
  } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="viewing-box" style={{ marginBottom: 30 }}>
        Now Viewing: <b>{collection.name}</b>
        <span className="a-href is-pulled-right" onClick={openModal}>
          {Object.keys(meraki).includes("name")
            ? `Edit Cam: ${meraki.name}`
            : null}
        </span>
      </div>
      {loading && (
        <div className="loading-container">
          <img className="loading" src={LoadingGif} alt="Loading" />
        </div>
      )}
      {!loading && cameraType === "static" && (
        <UIMerakiFormStatic loading={loading} setLoading={setLoading} />
      )}
      {!loading && cameraType === "sense" && (
        <UIMerakiFormSense loading={loading} setLoading={setLoading} />
      )}
    </>
  );
};

export default UIMerakiForm;
