import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UIMerakiModalForm from "./Form";
import UIMerakiModalList from "./List";
import UIMerakiModalOption from "./Option";
import { modalVariant, modalChildVariant } from "./variants";
import axios from "axios";

const UIMerakiModal = ({ modal, modalLoad, closeModal }) => {
  const [option, setOption] = useState("existing");

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  useEffect(() => {
    if (loading) {
      const getList = async () => {
        const url = `${process.env.REACT_APP_SERVER_IP}/meraki/camera`;
        const response = await axios.get(url);
        const newList = Object.keys(response.data).map(name => ({
          ...response.data[name],
          name
        }));
        setList(newList);
        setLoading(false);
      };
      getList();
    }
  }, [loading, setLoading, setList]);

  return (
    <motion.div
      initial="hidden"
      animate={modal ? "visible" : "hidden"}
      variants={modalVariant}
      className="card-modal"
    >
      <AnimatePresence>
        {modalLoad && (
          <motion.div
            variants={modalChildVariant}
            exit={modalChildVariant.hidden}
            style={{ height: "100%" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 0
              }}
            >
              <h3 className="light-bold">Edit Camera</h3>
              <button className="delete is-large" onClick={closeModal}></button>
            </div>
            <UIMerakiModalOption option={option} setOption={setOption} />
            {option === "new" && (
              <UIMerakiModalForm
                list={list}
                setList={setList}
                setOption={setOption}
              />
            )}
            {option === "existing" && (
              <UIMerakiModalList
                closeModal={closeModal}
                loading={loading}
                list={list}
                setList={setList}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UIMerakiModal;
