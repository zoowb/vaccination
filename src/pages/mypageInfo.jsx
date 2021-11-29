import "./mypageInfo.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageBoxSet, { MyPageAlarm } from "../components/mypage/mypageBoxes";
import { useState, useEffect } from "react";
import axios from "axios";
const MyPageInfo = () => {
  const [name, setName] = useState("");
  const [ssn, setSsn] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState("");
  const [pw, setPw] = useState("");

  const getMyInfo = () => {
    const token = localStorage.getItem("accessToken");
    axios
      .post("/mypage/getinfo", { jwtToken: token })
      .then((response) => {
        setName(response.data.Name);
        setSsn(response.data.Ssn);
        setTel(response.data.Phone);
        setEmail(response.data.Email);
        setAddr(response.data.Location);
        setPw(response.data.Password);
      })
      .catch((e) => console.log(e));
  };

  const transPw = (pw) => {
    let result = "";
    for (let i = 0; i < pw.length; i++) {
      result += "*";
    }
    return result;
  };
  useEffect(() => {
    getMyInfo();
  }, []);

  return (
    <section className="mypageInfo">
      <MyPageWhole>
        <MyPageCategory selected={1} />
        <MyPageWhite>
          <MyPageBoxSet title={"이름"} value={name} num={2} />
          <MyPageBoxSet
            title={"주민번호"}
            value={ssn.substr(0, 8) + "******"}
            num={2}
          />
          <MyPageBoxSet title={"비밀번호"} value={transPw(pw)} num={2} />
          <MyPageBoxSet title={"전화번호"} value={tel} num={2} />
          <MyPageBoxSet title={"이메일"} value={email} num={2} />
          <MyPageBoxSet title={"주소"} value={addr} num={2} />
          {/* <MyPageAlarm /> */}
        </MyPageWhite>
      </MyPageWhole>
    </section>
  );
};
export default MyPageInfo;
