import React from "react";
import "./tablechart.css";

const TableChart = ({loc, first, done}) => {
    return (
        <div className={"visualline"}>
            <div className={"oneline"}>
                <div className={"location"}>{loc}</div>
                <div className={"first"}>{first}명</div>
                <div className={"done"}>{done}명</div>
            </div>
        </div>
    );
};

export default TableChart;