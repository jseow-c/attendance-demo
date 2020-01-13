import React, { useContext } from "react";
import { StoreContext } from "../../../../context";
import { motion, AnimatePresence } from "framer-motion";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

const animatePresenceProps = {
  initial: { opacity: 0, translateX: 10 },
  animate: { opacity: 1, translateX: 0 },
  exit: { opacity: 0, translateX: 10 }
};

const cardClass = {
  selected: "card card-collection has-background-info has-text-white",
  notSelected: "card card-collection"
};

const textClass = {
  selected: "title has-text-white",
  notSelected: "title"
};

const iconClass = {
  selected: "fas fa-check-circle has-text-white",
  notSelected: "fas fa-check-circle"
};

const nonDeleteList = ["default", "jlmv12"];

const UIMerakiModalCard = ({
  item,
  cardVariant,
  clickDelete = null,
  clickSelect = null,
  options = true
}) => {
  const {
    merakiStore: [meraki]
  } = useContext(StoreContext);
  const className =
    meraki.name === item.name ? cardClass.selected : cardClass.notSelected;
  const textClassName =
    meraki.name === item.name ? textClass.selected : textClass.notSelected;
  const iconClassName =
    meraki.name === item.name ? iconClass.selected : iconClass.notSelected;
  return (
    <motion.div variants={cardVariant} className="collection-container">
      <div className={className}>
        <div className="content">
          <div className="icon">
            <i className="fas fa-camera"></i>
          </div>
          <div className={textClassName} style={{ fontSize: "1.3em" }}>
            {item.name}
            <div style={{ fontSize: "0.75em" }}>
              NetworkID : {item.networkID}
            </div>
            <div style={{ fontSize: "0.75em" }}>
              Camera Serial: {item.camSerial}
            </div>
          </div>
          {options && (
            <AnimatePresence>
              <motion.div {...animatePresenceProps} className="collection-nav">
                <motion.div
                  layoutTransition={spring}
                  className="icon has-text-info"
                  onClick={clickSelect}
                >
                  <i className={iconClassName}></i>
                </motion.div>
                {!nonDeleteList.includes(item.name) && (
                  <motion.div
                    {...animatePresenceProps}
                    className="icon has-text-danger"
                    onClick={() => clickDelete(item)}
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

export default UIMerakiModalCard;
