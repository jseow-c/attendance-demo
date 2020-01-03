import React, { useContext } from "react";
import { StoreContext } from "../../../context";
import { motion } from "framer-motion";
import { listVariants, cardVariant } from "./variants";
import UIAttendanceCard from "./Card";

const UIAttendanceList = () => {
  const {
    attendanceStore: [attendance]
  } = useContext(StoreContext);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className="collection-container-list"
    >
      {attendance.map(item => (
        <UIAttendanceCard
          key={item.person_id}
          item={item}
          cardVariant={cardVariant}
        />
      ))}
    </motion.div>
  );
};

export default UIAttendanceList;
