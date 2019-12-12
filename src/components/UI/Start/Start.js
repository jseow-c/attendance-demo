import React, { useState, useEffect } from "react";
import Logo from "../../../img/school.png";
import UIStartCard from "./Card";
import LoadingGif from "../../../img/loading.gif";
import axios from "axios";
import UIStartModal from "./Modal";
import { motion } from "framer-motion";
import UIStartDelete from "./Delete";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

const nonDeleteList = ["Attendence", "MOHDemo", "TestId"];

const UIStart = ({ hide = false, setCollection, setCollectionModal }) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [mode, setMode] = useState("Select");
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");
  useEffect(() => {
    if (!hide && loading) {
      const getList = async () => {
        const url = `${process.env.REACT_APP_SERVER_IP}/intercorp/collection`;
        const response = await axios.get(url);
        setList(response.data);
        setLoading(false);
      };
      setTimeout(() => getList(), 1000);
    }
  }, [hide, loading]);
  return (
    <div className={loading ? "start-container loading" : "start-container"}>
      <div
        className="start-modal-bg"
        style={modal ? {} : { display: "none" }}
        onClick={() => setModal(false)}
      ></div>
      <UIStartModal
        list={list}
        hide={!modal}
        setList={setList}
        setModal={setModal}
      />
      <UIStartDelete
        modal={deleteModal}
        list={list}
        setList={setList}
        setModal={setDeleteModal}
        deleteItem={deleteItem}
      />
      {loading ? (
        <div>
          <img className="loading" src={LoadingGif} alt="Loading" />
        </div>
      ) : (
        <>
          <div className="placeholder" />
          <img className="logo" src={Logo} alt="Logo" />
          <h1>Collections</h1>
          <button
            className={`button-mode button ${
              mode === "Select" ? "is-link" : "is-danger"
            }`}
            onClick={() =>
              mode === "Select" ? setMode("Delete") : setMode("Select")
            }
          >
            Current Mode: {mode}
          </button>
          <div
            className={`start-list ${mode === "Delete" ? "mode-delete" : ""}`}
          >
            {list.map(item => (
              <motion.div key={item.id} layoutTransition={spring}>
                <UIStartCard
                  onClick={item => {
                    if (
                      mode === "Delete" &&
                      !nonDeleteList.includes(item.name)
                    ) {
                      setDeleteItem(item);
                      setDeleteModal(true);
                    } else {
                      setCollection(item);
                      setCollectionModal(false);
                    }
                  }}
                  item={item}
                />
              </motion.div>
            ))}
            <div
              className="card has-background-grey-light card-start card-add"
              onClick={() => (mode === "Select" ? setModal(true) : null)}
            >
              <i className="fas fa-plus-square has-text-white-ter"></i>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UIStart;
