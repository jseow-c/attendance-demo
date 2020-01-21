import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../../context";
import { nullImage } from "./nullImage";
import LoadingGif from "../../../../img/loading.gif";
import UIMerakiFormLoader from "./Loader";

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
  const [imageLoading, setImageLoading] = useState(false);

  const [retries, setRetries] = useState(4);

  // take image using meraki api - through backend nodejs svr
  const snapMeraki = async () => {
    const merakiUrl = `${process.env.REACT_APP_SERVER_IP}/meraki/snap/${meraki.name}`;
    const response = await axios.post(merakiUrl);
    setImage(response.data.image);
    setImageLoading(false);
    return response.data.image;
  };

  // analyze image using aws/intercorp FR - through backend nodejs svr
  const senseImage = async image => {
    const url = `${process.env.REACT_APP_SERVER_IP}/${recognition}/collection/${collection.id}/compare`;
    const options = { "Content-Type": "application/json" };
    const postData = { image };
    const resultResponse = await axios.post(url, postData, options);
    return resultResponse.data;
  };

  // check via mqtt if there's object/people detected through meraki api - through backend nodejs svr
  const checkMqtt = async () => {
    const url = `${process.env.REACT_APP_SERVER_IP}/meraki/camera/mqtt`;
    const options = { "Content-Type": "application/json" };
    const postData = { mqtt: meraki.mqttSense };
    const resultResponse = await axios.post(url, postData, options);
    return resultResponse.data.check;
  };

  // termination function used during sensing/analyzing
  const endCheck = async () => {
    setLoading(false);
    setImageLoading(false);
    if (isMobile) setTimeout(() => setStage(2), 500);
  };

  // click function when user prompt to sense using meraki
  const onSubmit = async () => {
    // initialize submission
    setAttendanceStatus("");
    setLoading(true);

    for (let i = 0; i < 3; i++) {
      setRetries(x => x - 1);
      setImageLoading(true);

      // connect to mqtt server and check if there's people in the camera
      const check = await checkMqtt();

      if (check) {
        // snap image and analyze
        const image = await snapMeraki();
        const result = await senseImage(image);
        setAttendance(result);
        if (result.length === 0) {
          setAttendanceStatus("No results/attendance found.");
        } else {
          setAttendanceStatus("");
          endCheck();
          break;
        }
      } else {
        setAttendanceStatus("No results/attendance found.");
      }
    }
    setRetries(4);
    endCheck();
  };

  return (
    <div className="image-container">
      {/* Image Preview */}
      <div className="field w-100">
        <div className="avatar-upload avatar-meraki">
          <div className="avatar-preview">
            <div
              id="imagePreview"
              style={{
                backgroundImage: `url(${
                  imageLoading ? LoadingGif : image ? image : nullImage
                })`,
                backgroundSize: imageLoading || !image ? "10vmin" : "cover"
              }}
            ></div>
          </div>
        </div>
      </div>
      {/* Sense Statistic Display */}
      <div
        className="analysis-loader"
        style={!imageLoading ? { opacity: 0 } : {}}
      >
        <UIMerakiFormLoader retries={retries} />
        <div className="analysis-title">
          <span>Retries Left</span>
          <span className="analysis-number">{retries}</span>
        </div>
      </div>
      {/* Sense Button */}
      <div className="control" onClick={onSubmit}>
        <button className={`button is-link ${loading ? "is-loading" : ""}`}>
          Activate MV Sense
        </button>
      </div>
    </div>
  );
};

export default UIMerakiFormSense;
