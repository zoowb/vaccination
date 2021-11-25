import React, {useState} from "react";
import WholeScreen from "../components/wholeScreen";
import Vaccineicon from "./image/vaccineicon.png"
import "./lookup.css";

const TARGETS = [
    {value: 1, name: "18~49세 (2003년생~1972년생) 미접종자"},
    {value: 2, name: "50세 이상 (1973년생 이상) 미접종자"}
];
const LOCATIONS1 = [
    {value: 1, name: "서울특별시"}
];
const LOCATIONS2 = [
    {value: 1, name: "강남구"}
];
const LOCATIONS3 = [
    {value: 1, name: "수서동"}
];

const SelectBoxT = (props) => {
    return(
        <select className = "targetBox">
            {props.inform.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

const SelectBoxL = (props) => {
    return(
        <select className = "locationBox">
            {props.inform.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

const Search = () => {
    return(
        <div className="searchset">
            <input className={"searchbar"} type="text" placeholder = "기관명 입력"></input>
            <button type="button" className={"searchbtn"}> 검색 </button>
            <div className={"radioset"}>
                <input className={"searchradio"} type="radio" />
                <div className={"radiotext"}>의원</div>
                <input className={"searchradio"} type="radio" />
                <div className={"radiotext"}>약국</div>
            </div>
        </div>
    );
};

const Hospitallist = ({address, hname}) => {
    return(
        <button type="button" className="hospitalist">
            <div className="haddress">{address}</div>
            <div className="hname">{hname}</div>
        </button>
    );
};

const HospitalLookDetail = ({hname, address, vacnum, phone, time1, time2, time3, time4, etc}) => {
    return(
        <div className="whitebox">
            <div className="firstline">
                <div className="detailname">{hname}</div>
                <button type="button" className="redbutton">예약</button>
            </div>
            <div className="secondline">
                <div className="detailaddress">{address}</div>
                <img className="detailimage" alt="vaccinelogo" src={Vaccineicon} />
                <div className="detailaddress">잔여</div>
                <div className="detailvacnum">{vacnum}</div>
            </div>
            <div className={"tableline"}>
                <div className={"tabletitle"}>연락처</div>
                <div className={"tablecontentsbox"}>
                    <div className={"tablecontents"}>{phone}</div>
                </div>
            </div>
            <div className={"tableline"}>
                <div className={"tabletitle"}>운영시간</div>
                <div className={"tablecontentsbox"}>
                    <div>
                        <div className={"timetext"}>
                            <div className={"normal"}>평</div>
                            <div className={"tablecontents"}>{time1}</div>
                        </div>
                        <div className={"timetext"}>
                            <div className={"sat"}>토</div>
                            <div className={"tablecontents"}>{time2}</div>
                        </div>
                        <div className={"timetext"}>
                            <div className={"sun"}>일</div>
                            <div className={"tablecontents"}>{time3}</div>
                        </div>
                        <div className={"timetext"}>
                            <div className={"holyday"}>공</div>
                            <div className={"tablecontents"}>{time4}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"tableline"}>
                <div className={"tabletitle"}>비고</div>
                <div className={"tablecontentsbox"}>
                    <div className={"tablecontents"}>{etc}</div>
                </div>
            </div>
        </div>
    );
};

const Lookup = () =>{
    return(
        <WholeScreen>
            <div className = "topside">
                    <div className = "biglayout">
                        <div className = "titlelu">대상</div>
                        <SelectBoxT inform={TARGETS}></SelectBoxT>
                        <div className={"checkset"}>
                            <input className = {"checkbox"} type="checkbox" />
                            <div className = {"checkboxtext"}>예약불가 포함</div>
                        </div>
                    </div>
                    <div className = "biglayout">
                        <div className = "titlelu">거주지</div>
                        <SelectBoxL inform={LOCATIONS1}></SelectBoxL>
                        <SelectBoxL inform={LOCATIONS2}></SelectBoxL>
                        <SelectBoxL inform={LOCATIONS3}></SelectBoxL>
                        <div className={"btnset"}>
                            <button type="button" className={"bluebtn"}> 결과보기 </button>
                            <button type="button" className={"redbtn"}> 초기화 </button>
                        </div>
                    </div>
            </div>
           <hr className={"hr"}></hr>
           <Search />
           <div className="searchnum">검색결과 총 24개</div>
           <div className="bottom">
                <div className="hlist">
                    <Hospitallist
                    address={"서울특별시 강남구 세곡동"}
                    hname={"청담오라클피부과성형외과의원"}
                    />
                    <Hospitallist address={"서울특별시 강남구 세곡동"} hname={"청담오라클피부과성형외과의원"}/>
                    <Hospitallist address={"서울특별시 강남구 세곡동"} hname={"청담오라클피부과성형외과의원"}/>
                    <Hospitallist address={"서울특별시 강남구 세곡동"} hname={"청담오라클피부과성형외과의원"}/>
                    <Hospitallist address={"서울특별시 강남구 세곡동"} hname={"청담오라클피부과성형외과의원"}/>
                </div>
                <HospitalLookDetail hname={"청담오라클피부과성형외과의원"} address={"서울특별시 강남구 광평로 281, (수서동, 2층일부)"} vacnum={"8"} phone={"02-6181-3855"} time1={"08:00 - 18:30"} time2={"미운영"} time3={"미운영"} time4={"미운영"} etc={"평일점심 12:00 - 13:00"} />
            </div>
        </WholeScreen>
    );
};
export default Lookup;