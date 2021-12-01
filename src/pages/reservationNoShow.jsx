import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import CheckBox from "../components/reservation/checkBox";
import HospitalList from "../components/reservation/hospitalList";
import initTmap from "../components/tmapfornoshow";
import "./reservationNoShow.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const ReservationNoShow = () => {
  const [ssn, setSsn] = useState("");
  let loc = {};
  let arr = [];
  let x = 0,
    y = 0;

  const getNoShow = () => {
    const token = localStorage.getItem("accessToken");
    axios
      .post("/mypage/getinfo", { jwtToken: token })
      .then((response) => {
        console.log(response);
        setSsn(response.data.Ssn);
        x = response.data.x;
        y = response.data.y;
        loc = {};
        loc.name = "현재 위치";
        loc.x = x;
        loc.y = y;
        arr.push(loc);
      })
      .catch((e) => console.log(e));
    axios
      .post("/vaccine/index", { ssn: ssn, jwtToken: token })
      .then((response) => {
        console.log("vaccine==", response);
        let length = response.data.hosList.length;
        response.data.hosList.map((data, i) => {
          axios
            .post("/search/more", { idx: data.Hnumber, isHos: true })
            .then((response) => {
              loc = {};
              loc.name = response.data.info.Hname;
              loc.x = response.data.info.x;
              loc.y = response.data.info.y;
              arr.push(loc);
              if (i == length - 1) {
                initTmap(x, y, arr);
              }
            })
            .catch((e) => console.log(e));
        });
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getNoShow();
  }, []);

  useEffect(() => {
    console.log(loc);
  }, [loc]);

  return (
    <WholeScreenWithHeader>
      <section className="noshow">
        <section className="leftside">
          <div className="head">
            <Title
              title={"잔여백신 조회"}
              subtitle={"집 근처의 잔여백신을 조회해보세요!"}
            />
          </div>
          <div className="noshowdisplay">
            <div className="checkbig">
              <CheckBox
                name1={"화이자"}
                name2={"모더나"}
                name3={"아스트라제네카"}
                name4={"얀센"}
              />
            </div>
            <button className="checksearchbtn">
              검색
            </button>
          </div>
          <div className="hospitalListBox">
            <HospitalList
              name={"참좋은 병원"}
              vname1={"화이자"}
              vnum1={12}
              vname2={"모더나"}
              vnum2={12}
              vname3={"아스트라제네카"}
              vnum3={10}
              time={"운영시간: 10:00~18:00"}
            />
            <HospitalList
              name={"참좋은 병원"}
              vname1={"화이자"}
              vnum1={12}
              vname2={"모더나"}
              vnum2={12}
              vname3={"아스트라제네카"}
              vnum3={10}
              time={"운영시간: 10:00~18:00"}
            />
            <HospitalList
              name={"참좋은 병원"}
              vname1={"화이자"}
              vnum1={12}
              vname2={"모더나"}
              vnum2={12}
              vname3={"아스트라제네카"}
              vnum3={10}
              time={"운영시간: 10:00~18:00"}
            />
            <HospitalList
              name={"참좋은 병원"}
              vname1={"화이자"}
              vnum1={12}
              vname2={"모더나"}
              vnum2={12}
              vname3={"아스트라제네카"}
              vnum3={10}
              time={"운영시간: 10:00~18:00"}
            />
            <HospitalList
              name={"참좋은 병원"}
              vname1={"화이자"}
              vnum1={12}
              vname2={"모더나"}
              vnum2={12}
              vname3={"아스트라제네카"}
              vnum3={10}
              time={"운영시간: 10:00~18:00"}
            />
            <HospitalList
              name={"참좋은 병원"}
              vname1={"화이자"}
              vnum1={12}
              vname2={"모더나"}
              vnum2={12}
              vname3={"아스트라제네카"}
              vnum3={10}
              time={"운영시간: 10:00~18:00"}
            />
            <HospitalList
              name={"참좋은 병원"}
              vname1={"화이자"}
              vnum1={12}
              vname2={"모더나"}
              vnum2={12}
              vname3={"아스트라제네카"}
              vnum3={10}
              time={"운영시간: 10:00~18:00"}
            />
            <HospitalList
              name={"참좋은 병원"}
              vname1={"화이자"}
              vnum1={12}
              vname2={"모더나"}
              vnum2={12}
              vname3={"아스트라제네카"}
              vnum3={10}
              time={"운영시간: 10:00~18:00"}
            />
          </div>
        </section>
        <div className="mapBox">
          <div className="mapMap" id="map_div" />
        </div>
      </section>
    </WholeScreenWithHeader>
  );
};
export default ReservationNoShow;
