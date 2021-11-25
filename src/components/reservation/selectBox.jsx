import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./selectBox.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
registerLocale("ko", ko);
const SelectBox = ({ pick }) => {
  return (
    <section className="selectBoxSection">
      <select
        className="selectBox"
        placholeder={"선택"}
        name={"si"}
        id="loc"
        onChange={() => pick()}
      >
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

  useEffect(() => {
    console.log(
      `선택한 날짜는 ${startDate.toISOString().substr(0, 10)}입니다.`
    );
  }, [startDate]);

  return (
    <section className="dateSection">
      <DatePicker
        locale="ko"
        className="datePicker"
        selected={startDate}
        minDate={new Date()}
        onChange={(date) => setStartDate(date)}
        id="datePicker"
      />
      <label htmlFor="datePicker" className="calendarImg" />
    </section>
  );
};
export { SelectBox, DateSelectBox };
