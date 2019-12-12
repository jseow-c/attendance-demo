import React from "react";

const UIStartCard = props => {
  const { item, onClick } = props;
  return (
    <div className="card card-start" onClick={() => onClick(item)}>
      <i class="fas fa-book"></i>
      <div className="card-name">{item.name}</div>
    </div>
  );
};

export default UIStartCard;
