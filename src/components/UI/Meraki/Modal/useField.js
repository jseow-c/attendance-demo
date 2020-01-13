import { useState } from "react";

const useField = ({
  initialValue = "",
  initialStatus = "This name is too short.",
  initialCheck = null
} = {}) => {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState(initialStatus);
  const onChange = e => {
    const newValue = e.target.value;

    // set change to state
    setValue(newValue);

    // check if name is taken
    // initialCheck function callback
    const checkedOk = initialCheck ? initialCheck(newValue) : true;
    if (!checkedOk) {
      setStatus("This name is unavailable.");
    } else {
      if (newValue.length < 3) {
        setStatus("This name is too short.");
      } else if (newValue.length > 100) {
        setStatus("This name is too long");
      } else {
        setStatus("");
      }
    }
  };
  return { value, setValue, status, setStatus, onChange };
};

export default useField;
