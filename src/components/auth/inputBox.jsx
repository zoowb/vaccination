import "./inputBox.css";
const InputBox = ({ type, placeholder, page, value, setValue }) => {
  const changeValue = (e) => {
    setValue(e.target.value);
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={page == "회원가입" ? "auth-inputBox2" : "auth-inputBox"}
      value={value}
      onChange={changeValue}
    />
  );
};

export default InputBox;
