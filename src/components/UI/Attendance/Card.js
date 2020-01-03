import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PersonLogo from "../../../img/person.png";
import { StoreContext } from "../../../context";

const animatePresenceProps = {
  initial: { opacity: 0, translateX: 10 },
  animate: { opacity: 1, translateX: 0 },
  exit: { opacity: 0, translateX: 10 }
};

const UIAttendanceCard = ({ item, cardVariant }) => {
  const { isMobile } = useContext(StoreContext);
  const source = item.thumbnail
    ? `data:image/png;base64, ${item.thumbnail}`
    : PersonLogo;
  return (
    <motion.div variants={cardVariant} className="collection-container">
      <div className="card card-collection">
        <div className="content">
          <div className="person-icon">
            <img style={{ borderRadius: "50%" }} src={source} alt="Person" />
          </div>
          <div className="title">{item.person_name}</div>
          <AnimatePresence>
            <motion.div
              {...animatePresenceProps}
              className="collection-nav"
              style={{ marginRight: isMobile ? 10 : 30 }}
            >
              <motion.div
                {...animatePresenceProps}
                className="icon has-text-success bold"
                style={isMobile ? { fontSize: "1.25em" } : {}}
              >
                {(item.confidence * 100).toFixed(2)}%
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default UIAttendanceCard;
