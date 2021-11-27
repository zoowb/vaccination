import "./medicalDetail.css";
const MedicalDetail = ({ hname, address }) => {
  return (
    <section className="medicalDetail">
      <div className="mainInfo">
        <h1 className="name">강남베스트내과의원</h1>
        <span className="addr">
          서울특별시 강남구 광평로 281, (수서동, 2층일부)
        </span>
      </div>
      <table className="otherInfo">
        <tbody>
          <tr>
            <th>연락처</th>
            <td>02-1234-5678</td>
          </tr>
          <tr>
            <th>운영시간</th>
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
          <tr>
            <th>비고</th>
            <td>평일 점심 12:00~13:00</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
export default MedicalDetail;
