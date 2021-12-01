const { kakao } = window;
const GeoCoder = (addr, setX, setY) => {
  var geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch(addr, function (results, status) {
    if (status === kakao.maps.services.Status.OK) {
      var result = results[0]; //첫번째 결과의 값을 활용
      setX(result.x);
      setY(result.y);
    }
  });
};

export default GeoCoder;
