import React, { useState, useEffect } from "react";
import transVaccine, {transVaccinetoEng} from "../modules/translation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./hospitalList.css";

const HospitalList = ({ id, name, vaccine, time }) => {
  const navigate = useNavigate();
  const [modalOn, setModalOn] = useState(false);
  const [selectedvac, setSelectvac] = useState('');

  const onOpenModal = () => {
      setModalOn(!modalOn);
  };

  const getRev = () => {
    setModalOn(!modalOn);
    const token = localStorage.getItem("accessToken");
    axios
      .post("/vaccine/register", {jwtToken: token, rev_hos: id, rev_vacname: selectedvac })
      .then((response)=>{
        console.log("response받아옴!==", response.data);
      })
      .catch((e)=> console.log(e));
    navigate("/reservationComplete");
  };

  const Modal = () => {
    const handleChange = (e) => {
      console.log("선택한 값:", e.target.value);
      setSelectvac(transVaccinetoEng(e.target.value));
    };

    return (
      <div className="noshowmodal">
        <div className="bg" onClick={onOpenModal}></div>
        <div className="modalBox">
          <div className="modaltext">접종할 백신을 선택해주세요.</div>
          <div className="modalsm">
            <div className={"checkset"}>
              {vaccine.map((data, i) => {
                return (
                  <label className={"checksetflex"} key={i}>
                    <input
                      className={"checkbox"}
                      type="radio"
                      id="vac"
                      name="vac"
                      value={transVaccine(data.Vname)}
                      onChange={handleChange}
                    />
                    <div className={"checkboxtext"}>
                      {transVaccine(data.Vname)}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <button className="closeBtn" onClick={getRev}>
            <div className="btnText">선택완료 </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className={"outlistbox"}>
      {modalOn && <Modal onOpenModal={onOpenModal}></Modal>}
      <button type="button" className={"hospitallistBigBox"}>
        <div>
          <div className={"hospitalName"}>{name}</div>
          <div className={"vaccine"}>
            {vaccine.map((data, i) => {
              return (
                <>
                  <div className={"vaccineName"}>
                    {transVaccine(data.Vname)}
                  </div>
                  &nbsp;
                  <div className={"vaccineNum"}>{data.Amount}</div>
                </>
              );
            })}
          </div>
        </div>
      </button>
      <button type="button" className="redButton" onClick={onOpenModal}>
        <span className="redButtonText">예약하기</span>
      </button>
    </section>
  );
};

export default HospitalList;
