import "./mypageInfoEdit.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageBoxSet, { MyPageAlarm } from "../components/mypage/mypageBoxes";
import MyPageBtn from "../components/mypage/mypageBtn";
import { useState } from "react";
const MyPageInfoEdit = () => {
  const [tel, setTel] = useState("010-0000-1111");
  const [email, setEmail] = useState("email@email.com");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [addr, setAddr] = useState("다산순환로 300, 반도유보라");
  return (
    <section className="mypageInfoEdit">
      <MyPageWhole>
        <MyPageCategory selected={1} />
        <MyPageWhite>
          <MyPageBoxSet title={"이름"} value={"홍길동"} num={2} />
          <MyPageBoxSet title={"주민번호"} value={"000101-3******"} num={2} />
          <MyPageBoxSet
            title={"전화번호"}
            type={"tel"}
            value={tel}
            setValue={setTel}
            num={1}
          />
          <MyPageBoxSet
            title={"이메일"}
            type={"email"}
            value={email}
            setValue={setEmail}
            num={1}
          />
          <MyPageBoxSet
            title={"비밀번호"}
            type={"password"}
            value={pw}
            setValue={setPw}
            num={1}
          />
          <MyPageBoxSet
            title={"비밀번호 확인"}
            type={"password"}
            value={pwConfirm}
            setValue={setPwConfirm}
            num={1}
          />
          <MyPageBoxSet
            title={"주소"}
            type={"text"}
            value={addr}
            setValue={setAddr}
            num={1}
          />
          <MyPageAlarm />
          <section className="btnSection">
            <MyPageBtn text={"수정한 정보 저장"} num={2} />
          </section>
        </MyPageWhite>
      </MyPageWhole>
    </section>
  );
};
export default MyPageInfoEdit;
