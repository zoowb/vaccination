import "./categoryBox.css";
import { Link } from "react-router-dom";
const CategoryBox = ({ bTitle, content, url }) => {
  return (
    <Link to={url}>
      <button type="button" className="categoryBox">
        <div className="text">
          <span className="bigTitle">
            코로나19 <span className="smallTitle">COVID-19</span>
          </span>
          <h1 className="bigTitle">{bTitle}</h1>
          <p className="content">{content}</p>
        </div>
        <div
          className={
            bTitle == "예방접종 사전예약"
              ? "img1"
              : bTitle == "잔여백신 조회"
              ? "img2"
              : "img3"
          }
        />
      </button>
    </Link>
  );
};

export default CategoryBox;
