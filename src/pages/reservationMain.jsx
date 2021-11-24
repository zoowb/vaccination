import WholeScreen from "../components/wholeScreen";
import CategoryBox from "../components/reservation/categoryBox";
import "./reservationMain.css";
const ResMain = () => {
  return (
    <section className="reservationMain">
      <WholeScreen>
        <div className="titleSection">
          <h1 className="title">예약하기</h1>
          <span className="subtitle">코로나19 백신을 예약해보세요!</span>
        </div>
        <CategoryBox
          bTitle={"예방접종 사전예약"}
          content={"지금 코로나19 백신을 예약하세요!"}
          url={"/reservation"}
        />
        <CategoryBox
          bTitle={"잔여백신 조회"}
          content={"우리 집 근처의 잔여백신을 조회해보세요!"}
          url={"/reservationNoShow"}
        />
        <CategoryBox
          bTitle={"접종 예약 변경"}
          content={"예약하신 백신 접종을 변경하실 수 있습니다!"}
          url={"/reservationChange"}
        />
      </WholeScreen>
    </section>
  );
};
export default ResMain;
