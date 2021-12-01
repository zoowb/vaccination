import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import CheckBox from "../components/reservation/checkBox";
import HospitalList from "../components/reservation/hospitalList";
import initTmap from "../components/tmapfornoshow";
import "./reservationNoShow.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import GeoCoder from "../components/modules/geocoder";

const ReservationNoShow = () => {
  const [hosList, setHosList] = useState([]);
  let loc = {};
  let arr = [];
  let x = 0,
    y = 0;
  const [flist, setFlist] = useState([1, 1, 0, 0]);
  // let flist = [1, 1, 0, 0];
  const token = localStorage.getItem("accessToken");

  const getNoShow = () => {
    console.log("getnoshow 시작");
    const token = localStorage.getItem("accessToken");
    axios
      .post("/vaccine/index", { jwtToken: token, flist: flist })
      .then((response) => {
        setHosList(response.data.hosList);
        loc = {};
        loc.name = "현재 위치";
        loc.x = x = response.data.pos[0].x;
        loc.y = y = response.data.pos[0].y;
        arr.push(loc);
        console.log(response);
        let length = response.data.hosList.length;
        response.data.hosList.map((data, i) => {
          axios
            .post("/search/more", { idx: data.Hnumber, isHos: true })
            .then((response) => {
              loc = {};
              loc.name = response.data.info[0].Hname;
              loc.x = response.data.info[0].x;
              loc.y = response.data.info[0].y;
              console.log(response);
              arr.push(loc);
              if (i == length - 1) {
                initTmap(x, y, arr);
              }
            })
            .catch((e) => console.log(e));
        });
        if (response.data.hosList.length == 0) {
          initTmap(x, y, arr);
          console.log("따로");
        } else {
          console.log("따로x - hoslist: ", response.data.hosList);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getNoShow();
  }, []);

  // useEffect(() => {
  //   console.log(flist);
  //   getNoShow();
  // }, [flist]);

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
          <div className="checkbig">
            <CheckBox
              name1={"화이자"}
              name2={"모더나"}
              name3={"아스트라제네카"}
              name4={"얀센"}
              // flist={flist}
              // setFlist={setFlist}
            />
          </div>
          <div className="hospitalListBox">
            {hosList.map((data, i) => {
              console.log(data);
              return (
                <HospitalList
                  name={data.Hname}
                  vaccine={data.Vaccine}
                  time={"운영시간: 10:00~18:00"}
                  key={i}
                />
              );
            })}
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
