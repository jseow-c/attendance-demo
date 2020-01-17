import React, { useState, useContext } from "react";
import axios from "axios";
import { nullImage } from "./nullImage";
import { StoreContext } from "../../../../context";
import ImageJL from "../../../../img/sample_meraki_self.jpg";
import ImageCH from "../../../../img/sample_meraki_ch.jpg";
import LoadingGif from "../../../../img/loading.gif";

/**
 * Converts an image buffer to a base64 string.
 * @param {buffer} file Image Buffer
 *
 * @return {string} Base64 String of the Image Buffer
 */
const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const UIMerakiFormImage = () => {
  const {
    imageStore: [image, setImage],
    merakiStore: [meraki]
  } = useContext(StoreContext);
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
        <div className="avatar-edit">
          <label
            onClick={async () => {
              setLoading(true);
              const url = `${process.env.REACT_APP_SERVER_IP}/meraki/snap/${meraki.name}`;
              const response = await axios.post(url);
              setImage(response.data.image);
              setLoading(false);
            }}
          >
            <i className="fab fa-medium-m"></i>
          </label>
        </div>
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
        <div className="avatar-edit avatar-ch">
          <label onClick={() => setFixImage(ImageCH)}>
            <i className="fas fa-user-tie"></i>
          </label>
        </div>
        <div className="avatar-edit avatar-jl">
          <label onClick={() => setFixImage(ImageJL)}>
            <i className="fas fa-child"></i>
          </label>
        </div>
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
