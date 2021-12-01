const transVaccine = (name) => {
  if (name == "Pfizer") return "화이자";
  else if (name == "Morderna") return "모더나";
  else if (name == "AstraZeneca") return "아스트라제네카";
  else if (name == "Janssen") return "얀센";
};
export default transVaccine;
