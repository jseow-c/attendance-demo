import React, { useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../../context";
import UIMerakiFormImage from "./Image";

const UIMerakiFormStatic = ({ loading, setLoading }) => {
  const {
    imageStore: [image],
    recognitionStore: [recognition],
    collectionStore: [collection],
    attendanceStore: [, setAttendance],
    attendanceStatusStore: [, setAttendanceStatus],
    stageStore: [, setStage],
    isMobile
  } = useContext(StoreContext);

  // click function when user prompt to analyze image using facial recognition
  const onSubmit = async () => {
    if (image) {
      setLoading(true);
      setAttendanceStatus("");

      // send to backend for image analysis
      const url = `${process.env.REACT_APP_SERVER_IP}/${recognition}/collection/${collection.id}/compare`;
      const options = { "Content-Type": "application/json" };
      const postData = { image };
      const response = await axios.post(url, postData, options);
      setAttendance(response.data);

      // set attendance if there is
      if (response.data.length === 0)
        setAttendanceStatus("No results/attendance found.");
      else setAttendanceStatus("");

      // takes care of the stage in mobile
      if (isMobile) {
        setStage(2);
      } else setLoading(false);
    }
  };

  return (
    <div className="image-container">
      {/* Image Upload Container */}
      <UIMerakiFormImage />
      {/* Analysis Button */}
      <div className="control" onClick={onSubmit}>
        <button
          className={`button is-link ${loading ? "is-loading" : ""}`}
          disabled={image === null ? true : false}
        >
          Analyze Attendance
        </button>
      </div>
    </div>
  );
};

export default UIMerakiFormStatic;
