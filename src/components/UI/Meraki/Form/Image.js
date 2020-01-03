import React from "react";
import { nullImage } from "./nullImage";
import ImageJL from "../../../../img/sample_meraki_self.jpg";
import ImageCH from "../../../../img/sample_meraki_ch.jpg";

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const UIMerakiFormImage = ({ image, setImage }) => {
  const setFixImage = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const file = await toBase64(blob);
    setImage(file);
  };
  return (
    <div className="field w-100">
      <div className="avatar-upload avatar-meraki">
        <div className="avatar-edit">
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
              backgroundImage: `url(${image ? image : nullImage})`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UIMerakiFormImage;
