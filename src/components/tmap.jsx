import "./tmap.css";
const { Tmapv2 } = window;
const initTmap = (x, y) => {
  var map;
  map = new Tmapv2.Map("map_div", {
    center: new Tmapv2.LatLng(y, x),
    width: "100%",
    height: "400px",
  });
  var marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(y, x),
    map: map,
  });
};

export default initTmap;
