import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import useField from "./useField";
import UIMerakiModalField from "./Field";
import { listVariants, cardVariant } from "../../variants";

const UIMerakiModalForm = ({ list, setList, setOption }) => {
  const nameProps = useField({});
  const networkProps = useField({ initialStatus: "Network invalid." });
  const serialProps = useField({ initialStatus: "Serial invalid." });
  const mqttProps = useField({ initialStatus: "MQTT address invalid." });
  const apikeyProps = useField({ initialStatus: "" });

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
      let apiKey = list[list.findIndex(i => i.name === "jlmv12")].apiKey;
      if (apikeyProps.value) {
        apiKey = apikeyProps.value;
      }
      newList.push({
        name: nameProps.value,
        networkID: networkProps.value,
        camSerial: serialProps.value,
        mqttSense: mqttProps.value,
        apiKey
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
      <motion.div className="columns" variants={cardVariant}>
        <div className="column is-half pt-0 pb-0">
          <UIMerakiModalField {...networkProps} name="Network ID" />
        </div>
        <div className="column is-half pt-0 pb-0">
          <UIMerakiModalField {...mqttProps} name="MQTT Address" />
        </div>
      </motion.div>

      <motion.div className="field-mb" variants={cardVariant}>
        <div className="field">
          <label className="label">API Key</label>
          <div className="control">
            <input
              className="input is-secondary"
              type="text"
              placeholder="Optional"
              value={apikeyProps.value}
              onChange={apikeyProps.onChange}
            />
          </div>
          <p className="help is-secondary">
            If left unfilled - will use Jun Liang's API key.
          </p>
        </div>
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
