import "./tmap.css";
const { Tmapv2 } = window;
var map, marker;
var label;
const initTmap = (x, y, positions) => {
  map = new Tmapv2.Map("map_div", {
    center: new Tmapv2.LatLng(y, x),
    width: "100%",
    height: "100%",
  });

  for (let i = 0; i < 3; i++) {
    map.zoomOut();
  }

  if (positions != []) {
    for (var i = 0; i < positions.length; i++) {
      var lonlat = new Tmapv2.LatLng(positions[i].y, positions[i].x);
      var title = positions[i].name;
      if (title == "현재 위치") {
        label =
          "<span style='background-color: #cd2a82; color:#fff; font-size:16px; font-weight:500;'>" +
          title +
          "</span>";
      } else {
        label =
          "<span style='background-color: #5064c5; color:#fff; font-size:16px; font-weight:500;'>" +
          title +
          "</span>";
      }
      marker = new Tmapv2.Marker({
        position: lonlat, //Marker의 중심좌표 설정.
        map: map, //Marker가 표시될 Map 설정.
        title: title, //Marker 타이틀
        label: label,
      });
    }
  }
};

export default initTmap;
