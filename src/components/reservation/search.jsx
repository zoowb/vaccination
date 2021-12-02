import axios from "axios";
const Search = (
  setCnt,
  sigunguPick,
  startDate,
  setResultList,
  setMedicalPick,
  setSelectedTime
) => {
  let valid = !isNaN(startDate.valueOf());
  const token = localStorage.getItem("accessToken");

  setCnt(0);
  if (valid) {
    axios
      .post("/reservation/search", {
        jwtToken: token,
        data: sigunguPick,
        rev_date: startDate?.toISOString()?.substr(0, 10),
      })
      .then((response) => {
        console.log(response);
        setResultList(response.data.hos_info);
        setMedicalPick("");
        setSelectedTime("없음");
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

const DetailSearch = (medicalPick, startDate, setMedicalInfo) => {
  axios
    .get(
      `/reservation/search/${medicalPick}/${startDate
        ?.toISOString()
        ?.substr(0, 10)}`,
      { idx: medicalPick, date: startDate.toISOString().substr(0, 10) }
    )
    .then((response) => {
      setMedicalInfo(response.data);
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};

export { Search, DetailSearch };
