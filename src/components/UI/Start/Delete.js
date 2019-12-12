import React, { useState } from "react";
import axios from "axios";

const UIStartDelete = ({ modal, setModal, deleteItem, list, setList }) => {
  const [loading, setLoading] = useState(false);
  const onCancel = () => setModal(false);
  const onDelete = async () => {
    setLoading(true);
    const url = `${process.env.REACT_APP_SERVER_IP}/intercorp/collection`;
    const options = {
      data: { id: deleteItem.id }
    };
    await axios.delete(url, options);
    setLoading(false);
    const newList = list.slice();
    newList.splice(
      list.findIndex(i => i.id === deleteItem.id),
      1
    );
    setList(newList);
    setModal(false);
  };
  return (
    <div className={`modal ${modal ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onCancel}></div>
      <div className="modal-content">
        <div class="box">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  Are you sure you want to delete the following collection -
                  &nbsp;
                  <strong>{deleteItem.name}</strong>?
                </p>
                <nav>
                  <div class="is-pulled-right">
                    <button
                      className={`button is-danger mr-1 ${
                        loading ? "is-loading" : ""
                      }`}
                      onClick={onDelete}
                    >
                      Yes
                    </button>
                    <button className="button mr-1" onClick={onCancel}>
                      No
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </article>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  );
};

export default UIStartDelete;
