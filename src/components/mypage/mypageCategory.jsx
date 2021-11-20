import "./mypageCategory.css";
import { useNavigate } from "react-router-dom";
const MyPageCategory = ({ selected }) => {
  const navigate = useNavigate();
  return (
    <section className="mypageCategory">
      <h1 className="title">마이페이지</h1>
      <button
        type="button"
        className={selected == 1 ? "selectedBtn" : "unselectedBtn"}
        onClick={() => navigate("/mypageInfoEdit")}
      >
        회원정보 수정
      </button>
      <button
        type="button"
        className={selected == 2 ? "selectedBtn" : "unselectedBtn"}
        onClick={() => navigate("/mypageResInquiry")}
      >
        예약 내역 조회/변경/취소
      </button>
      <button
        type="button"
        className={selected == 3 ? "selectedBtn" : "unselectedBtn"}
      >
        예약 변경 이력
      </button>
    </section>
  );
};
export default MyPageCategory;
