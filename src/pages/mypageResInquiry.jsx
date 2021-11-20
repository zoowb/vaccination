import "./mypageResInquiry.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageBoxSet from "../components/mypage/mypageBoxes";
import MyPageBtn from "../components/mypage/mypageBtn";
const MyPageResInquiry = () => {
  return (
    <section className="mypageResInquiry">
      <MyPageWhole>
        <MyPageCategory selected={2} />
        <MyPageWhite>
          <MyPageBoxSet title={"예약번호"} value={"039202"} num={2} />
          <MyPageBoxSet title={"접종자 이름"} value={"홍길동"} num={2} />
          <MyPageBoxSet title={"1차 예약 백신"} value={"화이자"} num={2} />
          <MyPageBoxSet title={"1차 예약 기관"} value={"동길홍 의원"} num={2} />
          <MyPageBoxSet
            title={"1차 접종 일시"}
            value={"2021-08-08 / 10:00"}
            num={2}
          />
          <MyPageBoxSet title={"2차 예약 백신"} value={"화이자"} num={2} />
          <MyPageBoxSet title={"2차 예약 기관"} value={"동길홍 의원"} num={2} />
          <MyPageBoxSet
            title={"2차 접종 일시"}
            value={"2021-09-08 / 10:00"}
            num={2}
          />

          <section className="btnSection">
            <MyPageBtn text={"1차 접종 변경"} num={2} />
            <MyPageBtn text={"2차 접종 변경"} num={2} />
            <MyPageBtn text={"예약취소"} num={2} />
          </section>
        </MyPageWhite>
      </MyPageWhole>
    </section>
  );
};
export default MyPageResInquiry;
