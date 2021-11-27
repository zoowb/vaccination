import React, { useState } from "react";
import {WholeScreenWithHeader} from "../components/wholeScreen";
import Vaccineicon from "./image/vaccineicon.png";
import "./lookup.css";

const LOCATIONS1 = [{ value: 1, name: "서울특별시" }];
const LOCATIONS2 = [{ value: 1, name: "강남구" }];

const SelectBoxL = (props) => {
  return (
    <select className="lookuplocationBox">
      {props.inform.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

const Search = () => {
  return (
    <div className="lookupsearchset">
      <div>
        <input
          className={"searchbar"}
          type="text"
          placeholder="기관명 입력"
        ></input>
        <button type="button" className={"searchbtn"}>
          {" "}
          검색{" "}
        </button>
      </div>{" "}
      <div className={"radioset"}>
        <div className="hSelect">
          <input
            className={"searchradio"}
            type="radio"
            name="hType"
            id="hospital"
          />
          <label htmlFor="hospital" className="radiotext">
            의원
          </label>
        </div>
        <div className="hSelect">
          <input
            className={"searchradio"}
            type="radio"
            name="hType"
            id="pharmacy"
          />
          <label htmlFor="pharmacy" className="radiotext">
            약국
          </label>
        </div>
      </div>
    </div>
  );
};

const Hospitallist = ({ address, hname }) => {
  return (
    <button type="button" className="lookuphospitalist">
      <div className="haddress">{address}</div>
      <div className="hname">{hname}</div>
    </button>
  );
};

const HospitalLookDetail = ({
  hname,
  address,
  vacnum,
  phone,
  time1,
  time2,
  time3,
  time4,
  etc,
}) => {
  return (
    <div className="lookupwhitebox">
      <div className="firstline">
        <div className="detailname">{hname}</div>
        <button type="button" className="redbutton">
          예약
        </button>
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

const Lookup = () => {
  return (
    <WholeScreenWithHeader>
      <div className="lookup">
        <div className="lookuptopside">
          <div className="biglayout">
            <div className="titlelu">지역</div>
            <SelectBoxL inform={LOCATIONS1}></SelectBoxL>
            <SelectBoxL inform={LOCATIONS2}></SelectBoxL>
            <div className={"checkset"}>
              <input className={"checkbox"} type="checkbox" />
              <div className={"checkboxtext"}>예약불가 포함</div>
            </div>
            <div className={"btnset"}>
              <button type="button" className={"bluebtn"}>
                {" "}
                결과보기{" "}
              </button>
              <button type="button" className={"redbtn"}>
                {" "}
                초기화{" "}
              </button>
            </div>
          </div>
        </div>
        <hr className={"lookuphr"}></hr>
        <Search />
        <div className="lookupsearchnum">검색결과 총 24개</div>
        <div className="lookupbottomside">
          <div className="hlist">
            <Hospitallist
              address={"서울특별시 강남구 세곡동"}
              hname={"청담오라클피부과성형외과의원"}
            />
            <Hospitallist
              address={"서울특별시 강남구 세곡동"}
              hname={"청담오라클피부과성형외과의원"}
            />
            <Hospitallist
              address={"서울특별시 강남구 세곡동"}
              hname={"청담오라클피부과성형외과의원"}
            />
            <Hospitallist
              address={"서울특별시 강남구 세곡동"}
              hname={"청담오라클피부과성형외과의원"}
            />
            <Hospitallist
              address={"서울특별시 강남구 세곡동"}
              hname={"청담오라클피부과성형외과의원"}
            />
          </div>
          <HospitalLookDetail
            hname={"청담오라클피부과성형외과의원"}
            address={"서울특별시 강남구 광평로 281, (수서동, 2층일부)"}
            vacnum={"8"}
            phone={"02-6181-3855"}
            time1={"08:00 - 18:30"}
            time2={"미운영"}
            time3={"미운영"}
            time4={"미운영"}
            etc={"평일점심 12:00 - 13:00"}
          />
        </div>
      </div>
    </WholeScreenWithHeader>
  );
};
export default Lookup;
