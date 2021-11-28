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
  const [medicalTypePick, setMedicalTypePick] = useState("의원");
  const [name, setName] = useState("");
  const medical = ["의원", "약국"];
  const [medicalType, setMedicalType] = useState(true);

  const [resultList, setResultList] = useState("");
  const [medicalPick, setMedicalPick] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");

  const searchMedical = () => {
    axios
      .post("/search/search", {
        sigungu: sigunguPick,
        name: name,
        isHos: medicalTypePick == "의원" ? true : false,
      })
      .then((response) => {
        setResultList(response.data.list);
        setMedicalPick("");
        if (medicalTypePick == "의원") {
          setMedicalType(true);
        } else {
          setMedicalType(false);
        }
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getDetail = () => {
    axios
      .post("/search/more", { idx: medicalPick, isHos: medicalType })
      .then((response) => {
        setMedicalInfo(response.data.info);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getDetail();
  }, [medicalPick]);

  return (
    <WholeScreenWithHeader>
      <section className="lookupSection">
        <Title title={"기관 조회"} subtitle={"의원과 약국을 조회해보세요!"} />
        <SearchSection
          sido={sido}
          sidoPick={sidoPick}
          sigungu={sigungu}
          setSido={setSido}
          setSidoPick={setSidoPick}
          setSigungu={setSigungu}
          setSigunguPick={setSigunguPick}
          setMedicalTypePick={setMedicalTypePick}
          medical={medical}
          setName={setName}
          searchMedical={searchMedical}
        />
        {resultList ? (
          resultList?.length > 0 ? (
            <div className="medicalInquiry">
              <span className="totalNum">{`검색결과 총 ${resultList?.length}개`}</span>
              <div className="searchContents">
                <section className="listSection">
                  {resultList.map((data, i) => {
                    return medicalType == true ? (
                      <MedicalList
                        address={data.Hlocation}
                        name={data.Hname}
                        code={data.Hnumber}
                        setMedicalPick={setMedicalPick}
                        key={i}
                      />
                    ) : (
                      <MedicalList
                        address={data.Plocation}
                        name={data.Pname}
                        code={data.Pnumber}
                        setMedicalPick={setMedicalPick}
                        key={i}
                      />
                    );
                  })}
                </section>
                {medicalPick != "" ? (
                  medicalType == true ? (
                    <MedicalDetail
                      name={medicalInfo?.Hname}
                      addr={medicalInfo?.Hlocation}
                      phone={medicalInfo?.Hphone}
                      Other={medicalInfo?.Other}
                    />
                  ) : (
                    <MedicalDetail
                      name={medicalInfo?.Pname}
                      addr={medicalInfo?.Plocation}
                      phone={medicalInfo?.Pphone}
                      Other={medicalInfo?.Other}
                    />
                  )
                ) : (
                  <section className="beforePick">
                    <h1 className="text">
                      기관 상세 조회를 하시려면, <br />
                      먼저 기관을 선택해주세요.
                    </h1>
                  </section>
                )}
              </div>
            </div>
          ) : (
            <section className="beforeSearch">
              <h1 className="text">
                검색결과가 없습니다.
              </h1>
            </section>
          )
        ) : (
          <section className="beforeSearch">
            <h1 className="text">
              기관조회를 하시려면, 먼저 검색을 진행해주세요.
            </h1>
          </section>
        )}
      </section>
    </WholeScreenWithHeader>
  );
};
export default Lookup;
