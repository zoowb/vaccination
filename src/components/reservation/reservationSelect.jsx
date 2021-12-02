import { SelectBox } from "./selectBox";
import axios from "axios";
import { useEffect } from "react";
const ReservationSelect = ({
  sido,
  sidoPick,
  sigungu,
  setSido,
  setSidoPick,
  setSigungu,
  setSigunguPick,
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

  return (
    <div className="location">
      <SelectBox list={sido} pick={pickSido} check={1} />
      <SelectBox list={sigungu} pick={pickSigungu} check={2} />
    </div>
  );
};

const pickTime = (setSelectedTime) => {
  let select = document.querySelector('input[name="time"]:checked');
  let value = select.id.valueOf();
  setSelectedTime(value);
  console.log(value);
};

export { ReservationSelect, pickTime };
