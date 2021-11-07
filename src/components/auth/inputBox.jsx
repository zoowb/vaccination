import "./inputBox.css";
const InputBox = ({ type, placeholder, page }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={page == "회원가입" ? "auth-inputBox2" : "auth-inputBox"}
    ></input>
  );
};

export default InputBox;
