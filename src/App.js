import React, { useState } from "react";
import UICollection from "./components/UI/Collection/Collection";
import UIMeraki from "./components/UI/Meraki/Meraki";
import UIAttendenceList from "./components/UI/Attendence/List";
import UIStart from "./components/UI/Start/Start";

const App = () => {
  const [collection, setCollection] = useState(null);
  const [collectionModal, setCollectionModal] = useState(true);
  return (
    <div>
      <UIStart
        setCollection={setCollection}
        hide={!collectionModal}
        setCollectionModal={setCollectionModal}
      />
      <div className="container is-fluid wh-full">
        <div className="columns wh-full">
          <div className="column is-one-third wh-full">
            <UICollection />
          </div>
          <div className="column wh-full">
            <div className="container-body">
              <UIMeraki />
              <UIAttendenceList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
