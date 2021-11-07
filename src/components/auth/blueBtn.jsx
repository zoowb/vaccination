import "./blueBtn.css";
const BlueBtn = ({ text }) => {
  return (
    <button type="button" className="auth-blueBtn">
      <span className="text">{text}</span>
    </button>
  );
};
export default BlueBtn;
