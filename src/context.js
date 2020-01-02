import React, { useState } from "react";

export const StoreContext = React.createContext(null);

export default ({ children }) => {
  const [collection, setCollection] = useState({});
  const [collectionList, setCollectionList] = useState([]);
  const [people, setPeople] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const store = {
    collectionStore: [collection, setCollection],
    collectionListStore: [collectionList, setCollectionList],
    peopleStore: [people, setPeople],
    attendanceStore: [attendance, setAttendance]
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
