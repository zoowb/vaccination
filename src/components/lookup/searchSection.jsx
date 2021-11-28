import "./searchSection.css";
import SelectBox from "./selectBox";
import { useState, useEffect } from "react";
import axios from "axios";

const SearchSection = ({
  sido,
  sidoPick,
  sigungu,
  setSido,
  setSidoPick,
  setSigungu,
  setSigunguPick,
  setMedicalTypePick,
  medical,
  setName,
  searchMedical,
}) => {
  const getSido = () => {
    axios
      .get("/reservation/getSidoList")
      .then((response) => {
        setSido(response.data.sido);
        setSidoPick("110000");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getSigungu = () => {
    console.log(sido);
    axios
      .post("/reservation/getSigunguList", { sido: sidoPick })
      .then((response) => {
        setSigungu(response.data.SiGunGu);
        setSigunguPick(response.data.SiGunGu[0].Code);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getSido();
  }, []);

  useEffect(() => {
    getSigungu();
  }, [sidoPick]);

  const pickSido = () => {
    let select = document.getElementById("sido");
    let value = select?.options[select.selectedIndex].value;
    setSidoPick(value);
  };

  const pickSigungu = () => {
    let select = document.getElementById("sigungu");
    let value = select?.options[select.selectedIndex].value;
    setSigunguPick(value);
  };

  const pickMedical = () => {
    let select = document.getElementById("medical");
    let value = select?.options[select.selectedIndex].value;
    setMedicalTypePick(value);
  };

  return (
    <section className="lookup-search">
      <div className="firstLine">
        <div className="title">지역</div>
        <div className="selectSets">
          <SelectBox list={sido} pick={pickSido} check={1} />
          <SelectBox list={sigungu} pick={pickSigungu} check={2} />
          <SelectBox list={medical} pick={pickMedical} check={3} />
        </div>
      </div>
      <div className="secondLine">
        <div className="title">검색</div>
        <input
          type="text"
          className="searchName"
          placeholder={"기관명 입력 (미입력 시 전체 결과 검색)"}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button type="button" className="showResult" onClick={searchMedical}>
          결과보기
        </button>
      </div>
    </section>
  );
};

export default SearchSection;
