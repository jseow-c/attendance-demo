import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { StoreContext } from "../../../../context";
import UISidePeopleCheckBox from "./CheckBox";
import UISidePeopleModal from "./Modal";
import UISidePeopleList from "./List";
import LoadingGif from "../../../../img/loading.gif";

const UISidePeople = ({ setNav }) => {
  const {
    recognitionStore: [recognition],
    collectionStore: [collection],
    peopleStore: [, setPeople]
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
    setLoading(true);
  }, [setLoading, recognition]);

  useEffect(() => {
    if (loading && collection.id) {
      const getList = async () => {
        const url = `${process.env.REACT_APP_SERVER_IP}/${recognition}/collection/${collection.id}/person`;
        const response = await axios.get(url);
        setPeople(response.data);
        setLoading(false);
      };
      getList();
    } else if (!collection.id) {
      setNav("Collections");
    }
  }, [loading, collection.id, setPeople, setNav, recognition]);
  return (
    <div className="card-overall">
      <UISidePeopleModal {...modalProps} closeModal={closeModal} />
      <div className="viewing-box">
        Now Viewing: <b>{collection.name}</b>
      </div>
      <form className="ac-custom ac-checkbox ac-boxfill" autoComplete="off">
        <ul>
          <UISidePeopleCheckBox
            name="Allow deletion for people"
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
        <UISidePeopleList
          openModal={openModal}
          enableDelete={enableDelete}
          setModalItem={setModalItem}
        />
      )}
    </div>
  );
};

export default UISidePeople;
