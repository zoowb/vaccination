import "./reservationUnable.css";
import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import { useNavigate } from "react-router-dom";
const MypageResdelok = () => {
  const navigate = useNavigate();
  return (
    <WholeScreenWithHeader>
      <section className="reservationUnable">
        <Title
          title={"예약취소"}
          subtitle={"취소가 완료되었습니다.. "}
        />
        <section className="whiteSection">
          <span className="text">
            예약 취소가 완료되었습니다.
          </span>
        </section>

        <button type="button" className="residual" onClick={() => navigate("/")}>
          <span className="text">홈으로 이동하기</span>
        </button>
      </section>
    </WholeScreenWithHeader>
  );
};
export default MypageResdelok;
