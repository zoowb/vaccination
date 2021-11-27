import "./selectBox.css";
const SelectBox = ({ list, pick, check }) => {
  return (
    <select
      className="lookup-selectBox"
      onChange={pick}
      id={check == 1 ? "sido" : check == 2 ? "sigungu" : "medical"}
    >
      {list?.map((data, i) =>
        check == 1 ? (
          <option key={data.Code} value={data.Code}>
            {data.Sido}
          </option>
        ) : check == 2 ? (
          <option key={data.Code} value={data.Code}>
            {data.SiGunGu}
          </option>
        ) : (
          <option key={i} value={data}>
            {data}
          </option>
        )
      )}
    </select>
  );
};

export default SelectBox;
