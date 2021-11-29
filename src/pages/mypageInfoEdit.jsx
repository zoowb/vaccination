import "./mypageInfoEdit.css";
import MyPageWhole from "../components/mypage/mypageWhole";
import MyPageWhite from "../components/mypage/mypageWhite";
import MyPageCategory from "../components/mypage/mypageCategory";
import MyPageBoxSet, { MyPageAlarm } from "../components/mypage/mypageBoxes";
import MyPageBtn from "../components/mypage/mypageBtn";
import { useState, useEffect } from "react";
import axios from "axios";
import { telValidator, pwValidator } from "../components/modules/validation";
import DaumPost from "../components/modules/addr";
const MyPageInfoEdit = () => {
  const [name, setName] = useState("");
  const [ssn, setSsn] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [addr, setAddr] = useState("");
  const [err, setErr] = useState(false);
  const [errContent, setErrContent] = useState("");
  const [open, setOpen] = useState(false);
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");

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
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getMyInfo();
  }, []);

  useEffect(() => {
    if (pw == "" || tel == "" || pwConfirm == "") {
      setErr(true);
      setErrContent("빈칸을 모두 채워주세요");
    } else if (!telValidator(tel)) {
      setErr(true);
      setErrContent("전화번호 형식이 잘못되었습니다.");
    } else if (!pwValidator(pw)) {
      setErr(true);
      setErrContent(
        "비밀번호는 문자와 숫자를 모두 포함해\n 6~10자로 입력해주세요."
      );
    } else if (pw != pwConfirm) {
      setErr(true);
      setErrContent("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    } else {
      setErr(false);
      setErrContent("");
    }
  }, [tel, pw, pwConfirm]);

  const editInfo = () => {
    axios
      .post("/mypage/changeinfo", {
        ssn: ssn,
        tel: tel,
        passwd: pw,
        location: addr,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    onChangeOpenPost();
  }, [addr]);

  const onChangeOpenPost = () => {
    setOpen(!open);
  };

  return (
    <section className="mypageInfoEdit">
      {open ? (
        <section
          className="background"
          id="addrBack"
          onClick={onChangeOpenPost}
        >
          <div className="postDiv">
            <DaumPost
              setAddr={setAddr}
              setSido={setSido}
              setSigungu={setSigungu}
            />
          </div>
        </section>
      ) : (
        <></>
      )}
      <MyPageWhole>
        <MyPageCategory selected={2} />
        <MyPageWhite>
          <MyPageBoxSet title={"이름"} value={name} num={2} />
          <MyPageBoxSet
            title={"주민번호"}
            value={ssn.substr(0, 8) + "******"}
            num={2}
          />
          <MyPageBoxSet
            title={"전화번호"}
            type={"tel"}
            value={tel}
            setValue={setTel}
            num={1}
          />
          <MyPageBoxSet title={"이메일"} value={email} num={2} />
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

          <section className="mypageBoxSet">
            <h1 className="boxTitle">주소</h1>
            <button
              type="button"
              className="mypageButtonBox"
              onClick={onChangeOpenPost}
            >
              {addr ? (
                addr
              ) : (
                <span className="addr-placeholder">
                  주소를 입력하려면 클릭하세요
                </span>
              )}
            </button>
          </section>

          {/* <MyPageAlarm /> */}
          {err ? <span className="error">{errContent}</span> : <></>}
          <section className="btnSection">
            <MyPageBtn
              text={"수정한 정보 저장"}
              num={2}
              disable={err}
              onClick={editInfo}
            />
          </section>
        </MyPageWhite>
      </MyPageWhole>
    </section>
  );
};
export default MyPageInfoEdit;
