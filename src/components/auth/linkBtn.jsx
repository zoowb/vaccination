import "./linkBtn.css";
import { Link } from "react-router-dom";
const LinkBtn = ({ text, url }) => {
  return (
    <Link to={url} className="linkBtn-link">
      <h3 className="linkBtn-text">{text}</h3>
    </Link>
  );
};

const LinkBtnSet = ({ text1, url1, text2, url2, text3, url3 }) => {
  return (
    <div className="linkBtnSet">
      <LinkBtn text={text1} url={url1} />
      &nbsp;
      <span className="line">|</span>
      &nbsp;
      <LinkBtn text={text2} url={url2} />
      &nbsp;
      <span className="line">|</span>
      &nbsp;
      <LinkBtn text={text3} url={url3} />
    </div>
  );
};
export default LinkBtnSet;
