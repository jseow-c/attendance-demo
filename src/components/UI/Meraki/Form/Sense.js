import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../../context";
import { nullImage } from "./nullImage";
import LoadingGif from "../../../../img/loading.gif";

const UIMerakiFormSense = () => {
  const {
    merakiStore: [meraki],
    imageStore: [image, setImage],
    recognitionStore: [recognition],
    collectionStore: [collection],
    attendanceStore: [, setAttendance],
    attendanceStatusStore: [, setAttendanceStatus],
    stageStore: [, setStage],
    isMobile
  } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setAttendanceStatus("");
    const merakiUrl = `${process.env.REACT_APP_SERVER_IP}/meraki/snap/${meraki.name}`;
    const response = await axios.post(merakiUrl);
    setImage(response.data.image);
    const url = `${process.env.REACT_APP_SERVER_IP}/${recognition}/collection/${collection.id}/compare`;
    const options = { "Content-Type": "application/json" };
    const postData = { image: response.data.image };
    const resultResponse = await axios.post(url, postData, options);
    setAttendance(resultResponse.data);

    if (resultResponse.data.length === 0)
      setAttendanceStatus("No results/attendance found.");
    else setAttendanceStatus("");
    if (isMobile) {
      setStage(2);
    } else setLoading(false);
  };

  return (
    <div className="image-container">
      <div className="field w-100">
        <div className="avatar-upload avatar-meraki">
          <div className="avatar-preview">
            <div
              id="imagePreview"
              style={{
                backgroundImage: `url(${
                  loading ? LoadingGif : image ? image : nullImage
                })`,
                backgroundSize: loading || !image ? "10vmin" : "cover"
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="control" onClick={onSubmit}>
        <button className={`button is-link ${loading ? "is-loading" : ""}`}>
          Activate MV Sense
        </button>
      </div>
    </div>
  );
};

export default UIMerakiFormSense;
