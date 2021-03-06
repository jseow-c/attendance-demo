import React from "react";
import { nullImage } from "./nullImage";

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const UISidePeopleFormImage = ({ image, setImage }) => {
  return (
    <div className="field">
      <label className="label">Image</label>

      <div className="avatar-upload">
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
            <i className="fas fa-pen"></i>
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

export default UISidePeopleFormImage;
