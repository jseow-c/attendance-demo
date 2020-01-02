import React from "react";
import PersonLogo from "../../../../img/person.png";
import { motion, AnimatePresence } from "framer-motion";

const animatePresenceProps = {
  initial: { opacity: 0, translateX: 10 },
  animate: { opacity: 1, translateX: 0 },
  exit: { opacity: 0, translateX: 10 }
};

const UISideCollectionCard = ({
  item,
  enableDelete = false,
  cardVariant,
  clickDelete = null,
  options = true
}) => {
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
          <div className="title">{item.name}</div>
          {options && (
            <AnimatePresence>
              <motion.div {...animatePresenceProps} className="collection-nav">
                {enableDelete && (
                  <motion.div
                    {...animatePresenceProps}
                    className="icon has-text-danger"
                    onClick={clickDelete}
                  >
                    <i className="fas fa-times-circle"></i>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UISideCollectionCard;
