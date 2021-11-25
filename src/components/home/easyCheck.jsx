import "./easyCheck.css";
const EasyCheck = () => {
  return (
    <section className="easyCheck">
      <h1 className="title">
        간편 조회를 위해,
        <br />
        예약번호와 이름을 입력해주세요.
      </h1>
      <input type="text" className="inputBox" placeholder={"예약번호"} />
      <input type="text" className="inputBox" placeholder={"이름"} />
      <button type="button" className="btn">
        입력 완료
      </button>
    </section>
  );
};
export default EasyCheck;
