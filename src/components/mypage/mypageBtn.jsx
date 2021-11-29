import "./mypageBtn.css";
const MyPageBtn = ({ text, num, onClick, disable }) => {
  return (
    <button
      type="button"
      className={
        num == 1
          ? disable == true
            ? "mypageBlueDisabled"
            : "mypageBlueBtn"
          : disable == true
          ? "mypagePinkDisabled"
          : "mypagePinkBtn"
      }
      onClick={onClick}
      disabled={disable == true ? "disabled" : false}
    >
      {text}
    </button>
  );
};

export default MyPageBtn;
