import "./mypageBtn.css";
const MyPageBtn = ({ text, num }) => {
  return (
    <button
      type="button"
      className={num == 1 ? "mypageBlueBtn" : "mypagePinkBtn"}
    >
      {text}
    </button>
  );
};

export default MyPageBtn;
