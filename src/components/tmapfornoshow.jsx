import "./tmap.css";
const { Tmapv2 } = window;
var map,marker;
var label;
const initTmap = (x, y) => {
    map = new Tmapv2.Map("map_div", {
    center: new Tmapv2.LatLng(y, x),
    width: "100%",
    height: "100%",
  });

  var positions = [//다중 마커 저장 배열
    {
         title: 'SKT타워', 
         lonlat: new Tmapv2.LatLng(37.566369,126.984895)//좌표 지정
     },
     {
         title: '호텔', 
         lonlat: new Tmapv2.LatLng(37.564432,126.979979)
     },
     {
         title: '명동성당', 
         lonlat: new Tmapv2.LatLng(37.5632423,126.987210)
     },
     {
         title: '을지로3가역',
         lonlat: new Tmapv2.LatLng(37.566337,126.992703)
     },
     {
         title: '덕수궁',
         lonlat: new Tmapv2.LatLng(37.565861,126.975194)
     }
    ];
    
    for (var i = 0; i< positions.length; i++){//for문을 통하여 배열 안에 있는 값을 마커 생성
        var lonlat = positions[i].lonlat;
        var title = positions[i].title;
        //Marker 객체 생성.
        marker = new Tmapv2.Marker({
            position : lonlat, //Marker의 중심좌표 설정.
            map : map, //Marker가 표시될 Map 설정.
            title : title //Marker 타이틀.
        });
    }
};

export default initTmap;