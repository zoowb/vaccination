import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./selectBox.css";
const SelectBox = () => {
  //axios+map으로 할 예정
  //시/군/구 데이터 필요
  return (
    <section className="selectBoxSection">
      <select className="selectBox" placholeder={"선택"} name={"si"}>
        <option className="text" value="서울">
          서울
        </option>
        <option className="text" value="부산">
          부산
        </option>
        <option className="text" value="대구">
          대구
        </option>
      </select>
    </section>
  );
};

const DateSelectBox = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <section className="dateSection">
      <DatePicker
        className="datePicker"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      <div className="calendarImg" />
    </section>
  );
};
export { SelectBox, DateSelectBox };
