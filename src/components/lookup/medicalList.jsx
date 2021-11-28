import "./medicalList.css";
import { useState } from "react";
const MedicalList = ({ setMedicalPick, address, name, code }) => {
  return (
    <button
      type="button"
      className="lookup-medicalList"
      value={code}
      onClick={() => setMedicalPick(code)}
    >
      <div className="address">{address}</div>
      <div className="name">{name}</div>
    </button>
  );
};

export default MedicalList;
