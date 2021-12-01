import "./blueBtn.css";
const BlueBtn = ({ text, onClick, disable }) => {
  return (
    <button
      type="button"
      className={
        text == "회원가입"
          ? disable
            ? "Dauth-blueBtn2"
            : "auth-blueBtn2"
          : disable
          ? "Dauth-blueBtn"
          : "auth-blueBtn"
      }
      onClick={onClick}
      disabled={disable ? disable : ""}
    >
      <span className="text">{text}</span>
    </button>
  );
};
export default BlueBtn;
