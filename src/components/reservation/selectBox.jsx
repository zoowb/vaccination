import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./selectBox.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
registerLocale("ko", ko);

const SelectBox = ({ list, pick, check }) => {
  return (
    <section className="selectBoxSection">
      <select
        className="selectBox"
        id={check == 1 ? "sido" : "sigungu"}
        onChange={pick}
      >
        {list?.map((data, i) =>
          check == 1 ? (
            <option key={data.Code} value={data.Code}>
              {data.Sido}
            </option>
          ) : (
            <option key={data.Code} value={data.Code}>
              {data.SiGunGu}
            </option>
          )
        )}
      </select>
    </section>
  );
};

const DateSelectBox = ({startDate, setStartDate}) => {

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
