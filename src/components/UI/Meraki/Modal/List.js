import React, { useContext } from "react";
import { StoreContext } from "../../../../context";
import { motion } from "framer-motion";
import { listVariants, cardVariant } from "./variants";
import UIMerakiModalCard from "./Card";
import LoadingGif from "../../../../img/loading.gif";
import axios from "axios";

const UIMerakiModalList = ({ loading, list, setList, closeModal }) => {
  const {
    merakiStore: [, setMeraki]
  } = useContext(StoreContext);

  const onDelete = async item => {
    const url = `${process.env.REACT_APP_SERVER_IP}/meraki/camera`;
    const options = { "Content-Type": "application/json" };
    const newList = list.slice();
    const deleteIndex = list.findIndex(i => i.name === item.name);
    newList.splice(deleteIndex, 1);
    const postData = {
      data: newList.reduce((acc, cur) => {
        const { networkID, camSerial, mqttSense, apiKey } = cur;
        acc[cur.name] = { networkID, camSerial, mqttSense, apiKey };
        return acc;
      }, {})
    };
    await axios.post(url, postData, options);
    setList(newList);
  };

  return loading ? (
    <div className="loading-container">
      <img className="loading" src={LoadingGif} alt="Loading" />
    </div>
  ) : (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className="collection-container-list"
      style={{ height: "calc(100% - 110px)" }}
    >
      {list.map(item => (
        <UIMerakiModalCard
          key={item.name}
          item={item}
          cardVariant={cardVariant}
          clickSelect={() => {
            setMeraki(item);
            closeModal();
          }}
          clickDelete={onDelete}
        />
      ))}
    </motion.div>
  );
};

export default UIMerakiModalList;
