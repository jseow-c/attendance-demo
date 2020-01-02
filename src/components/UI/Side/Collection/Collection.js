import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../../../../context";
import UISideCollectionCheckBox from "./CheckBox";
import UISideCollectionModal from "./Modal";
import UISideCollectionList from "./List";
import LoadingGif from "../../../../img/loading.gif";

const UISideCollection = ({ setNav }) => {
  const {
    collectionListStore: [, setCollectionList]
  } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const [modalLoad, setModalLoad] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [enableDelete, setEnableDelete] = useState(false);
  const modalProps = { modal, modalItem, modalLoad, modalType };

  const closeModal = () => {
    setModalLoad(false);
    setModal(false);
  };

  const openModal = type => {
    setModalType(type);
    setTimeout(() => setModalLoad(true), 300);
    setModal(true);
  };

  useEffect(() => {
    if (loading) {
      const getList = async () => {
        const url = `${process.env.REACT_APP_SERVER_IP}/intercorp/collection`;
        const response = await axios.get(url);
        setCollectionList(response.data);
        setLoading(false);
      };
      getList();
    }
  }, [loading, setCollectionList]);
  return (
    <div className="card-overall">
      <UISideCollectionModal {...modalProps} closeModal={closeModal} />
      <form className="ac-custom ac-checkbox ac-boxfill" autoComplete="off">
        <ul>
          <UISideCollectionCheckBox
            name="Allow deletion for collection"
            checked={enableDelete}
            onChange={() => setEnableDelete(!enableDelete)}
          />
        </ul>
      </form>
      {loading && (
        <div className="loading-container">
          <img className="loading" src={LoadingGif} alt="Loading" />
        </div>
      )}
      {!loading && (
        <UISideCollectionList
          setNav={setNav}
          openModal={openModal}
          enableDelete={enableDelete}
          setModalItem={setModalItem}
        />
      )}
    </div>
  );
};

export default UISideCollection;
