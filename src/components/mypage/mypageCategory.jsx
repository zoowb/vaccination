import "./mypageCategory.css";
import { useNavigate } from "react-router-dom";
const MyPageCategory = ({ selected, hide }) => {
  const navigate = useNavigate();
  return (
    <section className="mypageCategory">
      <h1 className="title">마이페이지</h1>
      {hide == 1 ? (
        <></>
      ) : (
        <>
          <button
            type="button"
            className={selected == 1 ? "selectedBtn" : "unselectedBtn"}
            onClick={() => navigate("/mypageInfo")}
          >
            회원정보 조회
          </button>
          <button
            type="button"
            className={selected == 2 ? "selectedBtn" : "unselectedBtn"}
            onClick={() => navigate("/mypageInfoEdit")}
          >
            회원정보 수정
          </button>
          <button
            type="button"
            className={selected == 3 ? "selectedBtn" : "unselectedBtn"}
            onClick={() => navigate("/mypageResInquiry")}
          >
            예약 내역 조회/변경/취소
          </button>
        </>
      )}
    </section>
  );
};
export default MyPageCategory;
