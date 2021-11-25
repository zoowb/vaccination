import "./authBtn.css";
import { Link } from "react-router-dom";
const AuthBtn = ({ text, url }) => {
  return (
    <Link to={url} className="authBtn-link">
      <h3 className="authBtn-text">{text}</h3>
    </Link>
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