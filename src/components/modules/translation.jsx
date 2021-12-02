const transVaccine = (name) => {
  if (name == "Pfizer") return "화이자";
  else if (name == "Morderna") return "모더나";
  else if (name == "AstraZeneca") return "아스트라제네카";
  else if (name == "Janssen") return "얀센";
};

const transDate = (date) => {
  const newDate = new Date(date);
  const dateString = `${newDate.getFullYear()}-${
    newDate.getMonth() < 9
      ? `0${newDate.getMonth() + 1}`
      : newDate.getMonth() + 1
  }-${newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate()}`;
  const timeString = `${newDate.getHours()}:${newDate.getMinutes()}`;
  return `${dateString}, ${timeString}`;
};

export { transDate };
export default transVaccine;
