import "./mypageStart.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageInput from "../components/mypage/mypageInputBorder";
import MyPageBtn from "../components/mypage/mypageBtn";
const MyPageStart = () => {
  return (
    <>
      <MyPageWhole>
        <MyPageCategory />
        <MyPageWhite>
          <h1 className="mypageStartText">
            본인 확인을 위해,
            <br />
            아이디와 비밀번호를 입력해주세요.
          </h1>
          <div className="inputs">
            <MyPageInput type={"email"} text={"아이디(이메일)"} />
            <MyPageInput type={"password"} text={"비밀번호"} />
          </div>
          <MyPageBtn text={"입력 완료"} />
        </MyPageWhite>
      </MyPageWhole>
    </>
  );
};
export default MyPageStart;
