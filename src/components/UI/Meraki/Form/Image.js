import React, { useState, useContext } from "react";
import axios from "axios";
import { nullImage } from "./nullImage";
import { StoreContext } from "../../../../context";
import ImageJL from "../../../../img/sample_meraki_self.jpg";
import ImageCH from "../../../../img/sample_meraki_ch.jpg";
import LoadingGif from "../../../../img/loading.gif";
import { toBase64 } from "../../../../functions/misc";

const UIMerakiFormImage = () => {
  const {
    imageStore: [image, setImage],
    merakiStore: [meraki]
  } = useContext(StoreContext);

  // function to get static image and set it into imageStore
  const setFixImage = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const file = await toBase64(blob);
    setImage(file);
  };
  const [loading, setLoading] = useState(false);
  return (
    <div className="field w-100">
      <div className="avatar-upload avatar-meraki">
        {/* Button to use Meraki Camera */}
        <div className="avatar-edit">
          <label
            onClick={async () => {
              setLoading(true);
              const url = `${process.env.REACT_APP_SERVER_IP}/meraki/snap/${meraki.name}`;
              const postData = { timestamp: new Date().toISOString() };
              const response = await axios.post(url, postData);
              setImage(response.data.image);
              setLoading(false);
            }}
          >
            <i className="fab fa-medium-m"></i>
          </label>
        </div>
        {/* Button to upload image */}
        <div className="avatar-edit avatar-cam">
          <input
            type="file"
            id="imageUpload"
            accept=".png, .jpg, .jpeg"
            onChange={async e => {
              const file = await toBase64(e.target.files[0]);
              setImage(file);
            }}
          />
          <label htmlFor="imageUpload">
            <i className="fas fa-camera"></i>
          </label>
        </div>
        {/* Button for CH static image */}
        <div className="avatar-edit avatar-ch">
          <label onClick={() => setFixImage(ImageCH)}>
            <i className="fas fa-user-tie"></i>
          </label>
        </div>
        {/* Button for JL static image */}
        <div className="avatar-edit avatar-jl">
          <label onClick={() => setFixImage(ImageJL)}>
            <i className="fas fa-child"></i>
          </label>
        </div>
        {/* Image Preview */}
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
  );
};

export default UIMerakiFormImage;
