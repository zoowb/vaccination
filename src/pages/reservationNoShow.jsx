import Title from "../components/reservation/title";
import WholeScreen from "../components/wholeScreen";
import CheckBox from "../components/reservation/checkBox";
import HospitalList from "../components/reservation/hospitalList";
import initTmap from "../components/tmapfornoshow";
import "./reservationNoShow.css"
import React, { useEffect } from 'react';
import ReactDOM from "react-dom";

const  ReservationNoShow = () => {
    useEffect(() => {
        initTmap(126.984895, 37.566369);
      }, []);

    return (
        <WholeScreen>
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
                        name1 = {"화이자"}
                        name2 = {"모더나"}
                        name3 = {"아스트라제네카"}/>
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
                    <div className="mapMap" id="map_div"/>
                </div>
            </section>
        </WholeScreen>
    )
}
export default ReservationNoShow;