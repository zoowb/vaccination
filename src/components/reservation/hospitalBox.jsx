import "./hospitalBox.css";
const HospitalBigBox = ({ name, address }) => {
  return (
    <button type="button" className="hospitalBigBox">
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

const HospitalDetail = ({ name }) => {
  //시간=>axios로 데이터 받아와서 map으로 처리!
  return (
    <section className="hospitalDetailSection">
      <div className="selectionInfo">
        <h1 className="name">{name}</h1>
        <div className="btns">
          <SelectInfoBtn title={"시간 선택"} content={"11:00"} />
          <SelectInfoBtn title={"예약 현황"} content={"6/20명"} />
        </div>
      </div>
      <div className="selectBoxes">
        <TimeSelectLine
          time1={"10:00"}
          time2={"10:30"}
          time3={"11:00"}
          time4={"11:30"}
        />
        <TimeSelectLine
          time1={"12:00"}
          time2={"12:30"}
          time3={"13:00"}
          time4={"13:30"}
        />
        <TimeSelectLine
          time1={"14:00"}
          time2={"14:30"}
          time3={"15:00"}
          time4={"15:30"}
        />
        <TimeSelectLine
          time1={"16:00"}
          time2={"16:30"}
          time3={"17:00"}
          time4={"17:30"}
        />
      </div>
      <div className="hospitalInfo">
        <strong className="title">병원 정보</strong>
        <HospitalInfo />
      </div>
      <div className="hospitalLoc">
        <strong className="title">병원 위치</strong>
        <div className="map"></div>
      </div>
    </section>
  );
};

const HospitalInfo = () => {
  return (
    <table className="hospitalInfoTable">
      <tbody>
        <tr>
          <td>전화번호</td>
          <td>02-1234-5678</td>
        </tr>
        <tr>
          <td>진료시간</td>
          <td>
            월요일: 09:00~18:00
            <br />
            화요일: 10:00~20:00
            <br />
            수요일: 09:00~17:00
            <br />
            목요일: 10:00~20:00
            <br />
            금요일: 09:00~18:00
            <br />
            토요일: 09:00~14:00
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const TimeSelect = ({ time }) => {
  return (
    <section className="timeSelect">
      <input
        type="radio"
        id={time}
        name="time"
        value="time"
        className="radioBtn"
      />
      <label htmlFor={time} className="text">
        {time}
      </label>
    </section>
  );
};

const TimeSelectLine = ({ time1, time2, time3, time4 }) => {
  return (
    <section className="timeSelectLine">
      <TimeSelect time={time1} />
      <TimeSelect time={time2} />
      <TimeSelect time={time3} />
      <TimeSelect time={time4} />
    </section>
  );
};

export { HospitalBigBox, HospitalDetail };