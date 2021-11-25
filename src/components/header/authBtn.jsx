import "./authBtn.css";
import { useNavigate } from "react-router-dom";
const AuthBtn = ({ text, url }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="authBtn-link"
      onClick={() => {
        if (text == "로그아웃") {
          localStorage.removeItem("accessToken");
        }
        navigate(url);
      }}
    >
      <h3 className="authBtn-text">{text}</h3>
    </button>
  );
};

const AuthBtnSet = ({ text1, url1, text2, url2 }) => {
  return (
    <div className="authBtnSet">
      <AuthBtn text={text1} url={url1} />
      &nbsp;
      <span className="line">/</span>
      &nbsp;
      <AuthBtn text={text2} url={url2} />
    </div>
  );
};
export default AuthBtnSet;
