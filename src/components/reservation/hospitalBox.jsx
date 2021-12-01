import "./hospitalBox.css";
import { useEffect } from "react";
import initTmap from "../tmap";
import { moveTmap } from "../tmap";
const HospitalBigBox = ({
  name,
  address,
  code,
  setMedicalPick,
  setCnt,
  cnt,
}) => {
  return (
    <button
      type="button"
      className="hospitalBigBox"
      onClick={() => {
        setMedicalPick(code);
        setCnt(cnt + 1);
      }}
    >
      <h1 className="name">{name}</h1>
      <strong className="address">{address}</strong>
    </button>
  );
};

const SelectInfoBtn = ({ title, content }) => {
  return (
    <section className="selectInfoBtn">
      <span className="info-title">{title}</span>
      <span className="info-content">{content}</span>
    </section>
  );
};

const HospitalDetail = ({ medicalInfo, pickTime, selectedTime, cnt }) => {
  useEffect(() => {
    if (medicalInfo.hos_info?.x != undefined) {
      if (cnt == 1) {
        initTmap(medicalInfo.hos_info?.x, medicalInfo.hos_info?.y, 1);
      } else {
        moveTmap(medicalInfo.hos_info?.x, medicalInfo.hos_info?.y, 2);
      }
    }
  }, [medicalInfo.hos_info?.x]);

  return (
    <section className="hospitalDetailSection">
      <div className="selectionInfo">
        <h1 className="name">{medicalInfo.hos_info?.Hname}</h1>
        <div className="btns">
          <SelectInfoBtn title={"시간 선택"} content={selectedTime} />
          <SelectInfoBtn title={"예약 현황"} content={"6/20명"} />
        </div>
      </div>
      <div className="selectBoxes">
        <TimeSelectLine
          time1={"10:00"}
          time2={"10:30"}
          time3={"11:00"}
          time4={"11:30"}
          pickTime={pickTime}
        />
        <TimeSelectLine
          time1={"12:00"}
          time2={"12:30"}
          time3={"13:00"}
          time4={"13:30"}
          pickTime={pickTime}
        />
        <TimeSelectLine
          time1={"14:00"}
          time2={"14:30"}
          time3={"15:00"}
          time4={"15:30"}
          pickTime={pickTime}
        />
        <TimeSelectLine
          time1={"16:00"}
          time2={"16:30"}
          time3={"17:00"}
          time4={"17:30"}
          pickTime={pickTime}
        />
      </div>
      <div className="hospitalInfo">
        <strong className="title">병원 정보</strong>
        <HospitalInfo
          phone={medicalInfo.hos_info?.Hphone}
          time={medicalInfo.hos_timeinfo}
        />
      </div>
      <div className="hospitalLoc">
        <strong className="title">병원 위치</strong>
        <div id="map_div" />
        <div className="detailAddr">
          상세주소: {medicalInfo.hos_info?.Hlocation}
        </div>
      </div>
    </section>
  );
};

const HospitalInfo = ({ phone, time }) => {
  const makeTime = (time) => {
    let newTime = time?.slice(0, 2) + ":" + time?.slice(2, 4);
    return newTime;
  };

  return (
    <table className="hospitalInfoTable">
      <tbody>
        <tr>
          <td>전화번호</td>
          <td>{phone}</td>
        </tr>
        <tr>
          <td>진료시간</td>
          <td>
            월요일: {makeTime(time?.Start_Mon)}~{makeTime(time?.Close_Mon)}
            <br />
            화요일: {makeTime(time?.Start_Tue)}~{makeTime(time?.Close_Tue)}
            <br />
            수요일: {makeTime(time?.Start_Wed)}~{makeTime(time?.Close_Wed)}
            <br />
            목요일: {makeTime(time?.Start_Thu)}~{makeTime(time?.Close_Thu)}
            <br />
            금요일: {makeTime(time?.Start_Fri)}~{makeTime(time?.Close_Fri)}
            <br />
            토요일: {makeTime(time?.Start_Sat)}~{makeTime(time?.Close_Sat)}
            <br />
            일요일: {makeTime(time?.Start_Sun)}~{makeTime(time?.Close_Sun)}
            <br />
            점심시간: {time?.Lunch_Week}
            <br />
            공휴일: {time?.IsOpenHoliday}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const TimeSelect = ({ time, pickTime }) => {
  return (
    <section className="timeSelect">
      <input
        type="radio"
        id={time}
        name="time"
        className="radioBtn"
        onChange={() => pickTime()}
      />
      <label htmlFor={time} className="text">
        {time}
      </label>
    </section>
  );
};

const TimeSelectLine = ({ time1, time2, time3, time4, pickTime }) => {
  return (
    <section className="timeSelectLine">
      <TimeSelect time={time1} pickTime={pickTime} />
      <TimeSelect time={time2} pickTime={pickTime} />
      <TimeSelect time={time3} pickTime={pickTime} />
      <TimeSelect time={time4} pickTime={pickTime} />
    </section>
  );
};

export { HospitalBigBox, HospitalDetail };
