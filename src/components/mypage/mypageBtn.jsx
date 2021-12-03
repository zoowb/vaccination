import "./mypageBtn.css";
const MyPageBtn = ({ text, num, onClick, disable, isvac }) => {
  return (
    <button
      type="button"
      className={
        num == 1
          ? disable == true
            ? "mypageBlueDisabled"
            : "mypageBlueBtn"
          : isvac == 0
              ?"mypagePinkBtn"
              :"mypagePinkDisabled"
      }
      onClick={onClick}
      disabled={disable == true ? "disabled" : false}
    >
      {text}
    </button>
  );
};

export default MyPageBtn;
