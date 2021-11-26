import React from "react";
import "./tablechart.css";

const TableChart = ({location, first, done}) => {
    return (
        <div className={"visualline"}>
            <div className={"location"}>{location}</div>
            <div className={"first"}>{first}</div>
            <div className={"done"}>{done}</div>
        </div>
    );
};

export default TableChart;