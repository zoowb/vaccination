import React from "react";
import "./tablechart.css";

const TableChart = ({ check, result }) => {
  return (
    <div className={"visualline"}>
      {result.map((data, i) => {
        return (
          <div className={"oneline"}>
            <div className={"location"}>
              {check == true ? data.sido_name : `${data.ages}대`}
            </div>
            <div className={"first"}>{data.count}명</div>
            <div className={"done"}>{data.count2}명</div>
          </div>
        );
      })}
    </div>
  );
};

export default TableChart;
