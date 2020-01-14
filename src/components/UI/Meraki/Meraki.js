import React, { useContext, useState, useEffect } from "react";
import UIMerakiForm from "./Form/Form";
import { StoreContext } from "../../../context";
import UIMerakiOption from "./Option";
import UIMerakiModal from "./Modal/Modal";
import LoadingGif from "../../../img/loading.gif";
import axios from "axios";

const classes = {
  active: "nav-title title-with-subtitles light-bold",
  notActive: "nav-title title-with-subtitles light-bold muted"
};

const defaultMeraki = "default";

const UIMeraki = () => {
  const {
    collectionStore: [collection],
    merakiStore: [, setMeraki]
  } = useContext(StoreContext);

  const [modal, setModal] = useState(false);
  const [modalLoad, setModalLoad] = useState(true);
  const modalProps = { modal, modalLoad };
  const [loading, setLoading] = useState(true);
  const [initialPhase, setInitialPhase] = useState(true);

  const closeModal = () => {
    setModalLoad(false);
    setModal(false);
  };

  const openModal = () => {
    setTimeout(() => setModalLoad(true), 300);
    setModal(true);
  };

  useEffect(() => {
    if (loading) {
      const getDefault = async () => {
        const url = `${process.env.REACT_APP_SERVER_IP}/meraki/camera`;
        const response = await axios.get(url);
        setMeraki({
          ...response.data[defaultMeraki],
          name: defaultMeraki
        });
        setLoading(false);
        setInitialPhase(false);
      };
      getDefault();
    }
  }, [loading, setMeraki, setLoading]);

  const collectionExist = Object.keys(collection).length > 0;

  return (
    <div className="card card-register">
      <div className="card-content" style={{ height: "100%" }}>
        <div className="nav">
          <h4 className={collectionExist ? classes.active : classes.notActive}>
            Meraki Camera
          </h4>
        </div>
        <UIMerakiOption />
        {loading && !initialPhase ? (
          <div className="loading-container">
            <img className="loading" src={LoadingGif} alt="Loading" />
          </div>
        ) : (
          <div className="main-content">
            <div className="card-overall card-meraki">
              <UIMerakiModal {...modalProps} closeModal={closeModal} />
              {collectionExist && <UIMerakiForm openModal={openModal} />}
              {!collectionExist && (
                <div
                  style={{
                    display: "flex",
                    height: "50vmin",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  No collection selected.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIMeraki;
