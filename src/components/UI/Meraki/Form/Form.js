import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../../../context";
import LoadingGif from "../../../../img/loading.gif";
import UIMerakiFormImage from "./Image";

const UIMerakiForm = ({ openModal }) => {
  const {
    imageStore: [image],
    merakiStore: [meraki],
    recognitionStore: [recognition],
    collectionStore: [collection],
    attendanceStore: [, setAttendance],
    stageStore: [, setStage],
    isMobile
  } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (image) {
      setLoading(true);
      const url = `${process.env.REACT_APP_SERVER_IP}/${recognition}/collection/${collection.id}/compare`;
      const options = { "Content-Type": "application/json" };
      const postData = { image };
      const response = await axios.post(url, postData, options);
      console.log(response.data);
      setAttendance(response.data);
      if (isMobile) {
        setStage(2);
      } else setLoading(false);
    }
  };

  return (
    <>
      <div className="viewing-box" style={{ marginBottom: 30 }}>
        Now Viewing: <b>{collection.name}</b>
        <span className="a-href is-pulled-right" onClick={openModal}>
          {Object.keys(meraki).includes("name")
            ? `Edit Camera: ${meraki.name}`
            : null}
        </span>
        {isMobile && (
          <button
            className="button is-small is-dark"
            onClick={() => setStage(0)}
          >
            Back
          </button>
        )}
      </div>
      {loading && (
        <div className="loading-container">
          <img className="loading" src={LoadingGif} alt="Loading" />
        </div>
      )}
      {!loading && (
        <div className="image-container">
          <UIMerakiFormImage setLoading={setLoading} />
          <div className="control" onClick={onSubmit}>
            <button
              className={`button is-link ${loading ? "is-loading" : ""}`}
              disabled={image === null ? true : false}
            >
              Analyze Attendance
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UIMerakiForm;
