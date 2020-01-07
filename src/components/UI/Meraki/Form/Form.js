import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../../../context";
import LoadingGif from "../../../../img/loading.gif";
import UIMerakiFormImage from "./Image";

const UIMerakiForm = () => {
  const {
    recognitionStore: [recognition],
    collectionStore: [collection],
    attendanceStore: [, setAttendance],
    stageStore: [, setStage],
    isMobile
  } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

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
    <div className="card-overall card-meraki">
      <div className="viewing-box">
        Now Viewing: <b>{collection.name}</b>
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
          <UIMerakiFormImage image={image} setImage={setImage} />
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
    </div>
  );
};

export default UIMerakiForm;
