import "./medicalDetail.css";
const MedicalDetail = ({ name, addr, phone, Other }) => {
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
            <td>{Other}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
export default MedicalDetail;
