import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import useField from "./useField";
import UIMerakiModalField from "./Field";
import { listVariants, cardVariant } from "./variants";

const UIMerakiModalForm = ({ list, setList, setOption }) => {
  const nameProps = useField({});
  const networkProps = useField({ initialStatus: "Network invalid." });
  const serialProps = useField({ initialStatus: "Serial invalid." });
  const mqttProps = useField({ initialStatus: "MQTT address invalid." });

  const [loading, setLoading] = useState(false);

  const overallStatus =
    nameProps.status ||
    networkProps.status ||
    serialProps.status ||
    mqttProps.status;

  const onSubmit = async () => {
    if (!overallStatus) {
      setLoading(true);
      const url = `${process.env.REACT_APP_SERVER_IP}/meraki/camera`;
      const options = { "Content-Type": "application/json" };
      const newList = list.slice();
      newList.push({
        name: nameProps.value,
        networkID: networkProps.value,
        camSerial: serialProps.value,
        mqttSense: mqttProps.value,
        apiKey: list[list.findIndex(i => i.name === "jlmv12")].apiKey
      });
      const postData = {
        data: newList.reduce((acc, cur) => {
          const { networkID, camSerial, mqttSense, apiKey } = cur;
          acc[cur.name] = { networkID, camSerial, mqttSense, apiKey };
          return acc;
        }, {})
      };
      await axios.post(url, postData, options);
      setLoading(false);
      setList(newList);
      setOption("existing");
    }
  };
  return (
    <motion.div variants={listVariants}>
      <motion.div className="columns" variants={cardVariant}>
        <div className="column is-half pt-0 pb-0">
          <UIMerakiModalField {...nameProps} name="Name" />
        </div>
        <div className="column is-half pt-0 pb-0">
          <UIMerakiModalField {...serialProps} name="Serial" />
        </div>
      </motion.div>
      <motion.div className="field-mb" variants={cardVariant}>
        <UIMerakiModalField {...networkProps} name="Network ID" />
      </motion.div>
      <motion.div className="field-mb" variants={cardVariant}>
        <UIMerakiModalField {...mqttProps} name="MQTT Address" />
      </motion.div>
      <motion.div variants={cardVariant} className="control" onClick={onSubmit}>
        <button
          className={`button is-link ${loading ? "is-loading" : ""}`}
          disabled={overallStatus ? true : false}
        >
          Save
        </button>
      </motion.div>
    </motion.div>
  );
};

export default UIMerakiModalForm;
