import "./tmap.css";
const { Tmapv2 } = window;
var map;
var marker;
const initTmap = (x, y) => {
  map = new Tmapv2.Map("map_div", {
    center: new Tmapv2.LatLng(y, x),
    width: "100%",
    height: "400px",
  });
  marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(y, x),
    map: map,
  });
};

const moveTmap = (x, y) => {
  var lonlat = new Tmapv2.LatLng(y, x);
  map.setCenter(lonlat); // 지도의 중심 좌표를 설정합니다.
  marker.setPosition(lonlat);
};

export { moveTmap };
export default initTmap;
