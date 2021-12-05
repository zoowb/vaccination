import React, { useState } from "react";
import transVaccine from "../modules/translation";
import "./hospitalList.css";

const HospitalList = ({ name, vaccine, time }) => {
  const [modalOn, setModalOn] = useState(false);
  const onOpenModal = () => {
    setModalOn(!modalOn);
  };

  const Modal = () => {

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
                    />
                    <div className={"checkboxtext"}>
                      {transVaccine(data.Vname)}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <button className="closeBtn" onClick={onOpenModal}>
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
          <div className={"hospitalTime"}>{time}</div>
        </div>
      </button>
      <button type="button" className="redButton" onClick={onOpenModal}>
        <span className="redButtonText">예약하기</span>
      </button>
    </section>
  );
};

export default HospitalList;
