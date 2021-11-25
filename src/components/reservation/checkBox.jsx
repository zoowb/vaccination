import React, { useState, useCallback } from "react";
import "./checkBox.css"

const dataLists = [
  {id : 1, data : "화이자"},
  {id : 2, data : "모더나"},
  {id : 3, data : "아스트라제네카"}
]
const CheckBox = ({name1, name2, name3}) =>{
  return (
    <div className={"checkset"}>
      <input className={"checkbox"} type = "checkbox" />
      <div className={"checkboxtext"}>{name1}</div>
      <input className={"checkbox"} type = "checkbox" />
      <div className={"checkboxtext"}>{name2}</div>
      <input className={"checkbox"} type = "checkbox" />
      <div className={"checkboxtext"}>{name3}</div>
    </div>
  );
};
export default CheckBox;