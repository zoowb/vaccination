import "./medicalList.css";
import { useState } from "react";
const MedicalList = ({ address, hname, hcode }) => {
  const [hospitalPick, setHospitalPick] = useState("");
  return (
    <button
      type="button"
      className="lookup-medicalList"
      id="hos"
      value={hcode}
      onClick={() => setHospitalPick(hcode)}
    >
      <div className="address">{address}</div>
      <div className="name">{hname}</div>
    </button>
  );
};

export default MedicalList;
