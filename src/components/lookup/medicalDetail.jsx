import "./medicalDetail.css";
const MedicalDetail = ({ name, addr, phone, Other, time }) => {
  const makeTime = (time) => {
    let newTime = time?.slice(0, 2) + ":" + time?.slice(2, 4);
    return newTime;
  };

  return (
    <section className="medicalDetail">
      <div className="mainInfo">
        <h1 className="name">{name}</h1>
        <span className="addr">{addr}</span>
      </div>
      <table className="otherInfo">
        <tbody>
          <tr>
            <th>연락처</th>
            <td>{phone}</td>
          </tr>
          <tr>
            <th>운영시간</th>
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
          <tr>
            <th>비고</th>
            <td>{Other}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
export default MedicalDetail;
