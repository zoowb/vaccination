import React, { useState, useCallback } from "react";
import "./checkBox.css"

const dataLists = [
  {id : 1, data : "화이자"},
  {id : 2, data : "모더나"},
  {id : 3, data : "아스트라제네카"},
  {id : 4, data : "얀센"}
]

//const [checkedItems, setCheckedItems] = useState(new Set());

// const checkedItemHandler = (id, isChecked) => {
//   if(isChecked) {
//     checkedItems.add(id);
//     setCheckedItems(checkedItems);
//   } else if(!isChecked && checkedItems.has(id)) {
//     checkedItems.delete(id);
//     setCheckedItems(checkedItems);
//   }
// };

const CheckBox = ({name1, name2, name3, name4}) =>{
  return (
    <div className={"checkset"}>
      <label className={"checksetflex"}>
        <input className={"checkbox"} type = "checkbox" />
        <div className={"checkboxtext"}>{name1}</div>
      </label>
      <label className={"checksetflex"}>
      <input className={"checkbox"} type = "checkbox" />
      <div className={"checkboxtext"}>{name2}</div>
      </label>
      <label className={"checksetflex"}>
      <input className={"checkbox"} type = "checkbox" />
      <div className={"checkboxtext"}>{name3}</div>
      </label>
      <label className={"checksetflex"}>
        <input className={"checkbox"} type = "checkbox" />
        <div className={"checkboxtext"}>{name4}</div>
      </label>
    </div>
  );
};
export default CheckBox;