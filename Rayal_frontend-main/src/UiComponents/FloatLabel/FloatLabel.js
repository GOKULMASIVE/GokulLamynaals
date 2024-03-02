import React, { useState } from "react";
import './FloatLabel.scss'
const FloatLabel = (props) => {
  const [focus, setFocus] = useState(false);
  const { children, label, value, important } = props;
  const labelClass =
    focus || (value != null && value != undefined && value.length !== 0)
      ? "label label-float"
      : "label label";

  return (
    <div
      className="float-label"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {children}
      <label className={labelClass}>
        {label}&nbsp;{<span style={{ color: "red" }}>{important}</span>}
      </label>
    </div>
  );
};

export default FloatLabel;
