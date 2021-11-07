import "./inputBox.css";
const InputBox = ({ type, placeholder }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="auth-inputBox"
    ></input>
  );
};

export default InputBox;
