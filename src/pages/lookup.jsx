import React, { useState, useEffect } from "react";
import { WholeScreenWithHeader } from "../components/wholeScreen";
import axios from "axios";
import Title from "../components/reservation/title";
import "./lookup.css";
import SearchSection from "../components/lookup/searchSection";
import MedicalList from "../components/lookup/medicalList";
import MedicalDetail from "../components/lookup/medicalDetail";
const Lookup = () => {
  const [sido, setSido] = useState([]);
  const [sidoPick, setSidoPick] = useState("110000");
  const [sigungu, setSigungu] = useState([]);
  const [sigunguPick, setSigunguPick] = useState("110001");
  const [hospitalList, setHospitalList] = useState("");
  const [hospitalPick, setHospitalPick] = useState("");
  // const getSido = () => {
  //   axios
  //     .get("/reservation/getSidoList")
  //     .then((response) => {
  //       setSido(response.data.sido);
  //       setSidoPick("110000");
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  // const getSigungu = () => {
  //   console.log(sido);
  //   axios
  //     .post("/reservation/getSigunguList", { sido: sidoPick })
  //     .then((response) => {
  //       setSigungu(response.data.SiGunGu);
  //       setSigunguPick(response.data.SiGunGu[0].Code);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  // useEffect(() => {
  //   getSigungu();
  // }, [sidoPick]);

  // useEffect(() => {
  //   console.log("sidoPick: ", sido);
  // }, [sido]);

  const searchHospital = () => {
    axios
      .post("/search/searchHosByLoc", { sigungu: sigunguPick })
      .then((response) => {
        setHospitalList(response.data.list);
        console.log("hospital: ", response.data.list);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // useEffect(() => {
  //   getSido();
  // }, []);

  // useEffect(() => {
  //   console.log(hospitalPick);
  // }, [hospitalPick]);

  return (
    <WholeScreenWithHeader>
      <section className="lookupSection">
        <Title title={"기관 조회"} subtitle={"의원과 약국을 조회해보세요!"} />
        <SearchSection />
        <div className="medicalInquiry">
          <section className="listSection">
            <MedicalList address={"서울"} hname={"병원"} hcode={1111} />
            <MedicalList address={"서울"} hname={"병원"} hcode={1111} />
          </section>
          <MedicalDetail />
        </div>
      </section>
    </WholeScreenWithHeader>
  );
};
export default Lookup;
