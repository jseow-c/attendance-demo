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

const nonDeleteList = ["MOHDemo"];

const UISideCollectionCard = ({
  item,
  enableDelete = false,
  cardVariant,
  clickDelete = null,
  clickSelect = null,
  options = true
}) => {
  const {
    collectionStore: [collection]
  } = useContext(StoreContext);
  const className =
    collection.id === item.id ? cardClass.selected : cardClass.notSelected;
  const textClassName =
    collection.id === item.id ? textClass.selected : textClass.notSelected;
  return (
    <motion.div variants={cardVariant} className="collection-container">
      <div className={className}>
        <div className="content">
          <div className="icon">
            <i className="fas fa-book-open"></i>
          </div>
          <div className={textClassName}>{item.name}</div>
          {options && (
            <AnimatePresence>
              <motion.div {...animatePresenceProps} className="collection-nav">
                <motion.div
                  layoutTransition={spring}
                  className="icon has-text-info"
                  onClick={clickSelect}
                >
                  <i className="fas fa-check-circle"></i>
                </motion.div>
                {enableDelete && !nonDeleteList.includes(item.name) && (
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
