import Title from "../components/reservation/title";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import CheckBox from "../components/reservation/checkBox";
import HospitalList from "../components/reservation/hospitalList";
import initTmap from "../components/tmapfornoshow";
import "./reservationNoShow.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationNoShow = () => {
  const [hosList, setHosList] = useState([]);
  const [search, setSearch] = useState(true);
  let loc = {};
  let arr = [];
  let x = 0,
    y = 0;
  const [flist, setFlist] = useState([0, 0, 0, 0]);

  const token = localStorage.getItem("accessToken");

  const getNoShow = () => {
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
    console.log("flist===", flist);
  }, [flist]);

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
                flist={flist}
                setFlist={setFlist}
              />
            </div>
            <button
              type="button"
              className="checksearchbtn"
              onClick={() => {
                if (search) {
                  console.log("noshow");
                  getNoShow();
                } else {
                  window.location.reload();
                }
                setSearch(!search);
              }}
            >
              {search == true ? "검색" : "초기화"}
            </button>
          </div>
          <div className="hospitalListBox">
            {hosList.map((data, i) => {
              return (
                <HospitalList
                  name={data.Hname}
                  vaccine={data.Vaccine}
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
