import React, { useState } from "react";
import useWindowSize from "./functions/useWindowSize";

export const StoreContext = React.createContext(null);

export default ({ children }) => {
  const size = useWindowSize();
  const [stage, setStage] = useState(0);
  const [collection, setCollection] = useState({});
  const [collectionList, setCollectionList] = useState([]);
  const [people, setPeople] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const store = {
    isMobile: size.width < 1440,
    stageStore: [stage, setStage],
    collectionStore: [collection, setCollection],
    collectionListStore: [collectionList, setCollectionList],
    peopleStore: [people, setPeople],
    attendanceStore: [attendance, setAttendance]
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
