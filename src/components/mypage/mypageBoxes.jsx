import "./mypageBoxes.css";
const MyPageInputBox = ({ type, value, setValue }) => {
  const changeValue = (e) => {
    setValue(e.target.value);
  };
  return (
    <input
      type={type}
      value={value}
      className="mypageInputBox"
      onChange={changeValue}
    />
  );
};

const MyPageShowBox = ({ value }) => {
  return <div className="mypageShowBox">{value}</div>;
};

const MyPageBoxSet = ({ title, type, value, num, setValue }) => {
  return (
    <section className="mypageBoxSet">
      <h1 className="boxTitle">{title}</h1>
      {num == 1 ? (
        <MyPageInputBox type={type} value={value} setValue={setValue} />
      ) : (
        <MyPageShowBox value={value} />
      )}
    </section>
  );
};

const MyPageAlarm = () => {
  return (
    <section className="mypageAlarm">
      <h1 className="boxTitle">알림받기</h1>
      <input type="checkbox" id="emailAlarm" className="alarmCheckBox" />
      <label htmlFor="emailAlarm" className="alarmLabel">
        이메일 알림
      </label>
      <input type="checkbox" id="kakaoAlarm" className="alarmCheckBox" />
      <label htmlFor="kakaoAlarm" className="alarmLabel">
        카카오톡 알림
      </label>
    </section>
  );
};

export { MyPageAlarm };
export default MyPageBoxSet;
