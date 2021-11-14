import "./menuBtn.css";
import { Link } from "react-router-dom";
const MenuBtn = ({ text, url }) => {
  return (
    <Link to={url} className="menuBtn-link">
      <h2 className="menuBtn-text">{text}</h2>
    </Link>
  );
};

const MenuBtnSet = ({ text1, url1, text2, url2, text3, url3 }) => {
  return (
    <div className="menuBtnSet">
      <MenuBtn text={text1} url={url1} />
      &nbsp;
      <MenuBtn text={text2} url={url2} />
      &nbsp;
      <MenuBtn text={text3} url={url3} />
    </div>
  );
};
export default MenuBtnSet;
