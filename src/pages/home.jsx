import EasyCheck from "../components/home/easyCheck";
import WholeScreen from "../components/wholeScreen";
import LineChart from "../components/home/linechart";
import TableChart from "../components/home/tablechart";
import "./home.css";

const Home = () => {
  return(
    <WholeScreen>
      <div className={"all"}>
        <div className={"leftside"}>
          <div className={"smallleft"}>
            <div className={"boldtitle"}>백신 접종 완료자</div>
            <div className={"donebox"}>
              <div className={"done"}>
                <div className={"bluetitle"}>1차 접종완료</div>
                <div className={"bluenum"}>39,710,470</div>
                <div className={"blueper"}>(77.3%)</div>
              </div>
              <div className={"done"}>
                <div className={"redtitle"}>완전 접종완료</div>
                <div className={"rednum"}>26,982,724</div>
                <div className={"redper"}>(52.5%)</div>
              </div>
            </div>
            <div className={"linechart"}>
              <LineChart />
            </div>
            <div className={"btnset"}>
              <button type="button" className={"monweekday"}>월별</button>
              <button type="button" className={"monweekday"}>주별</button>
              <button type="button" className={"monweekday"}>날짜별</button>
            </div>
          </div>
        </div>
        <div className={"rightside"}>
          <div>
            <div className={"btnset"}>
              <button type="button" className={"locage"}>지역별 접종 현황</button>
              <button type="button" className={"locage"}>연령별 접종 현황</button>
            </div>
            <div className={"tablechart"}>
            </div>
          </div>
        </div>
      </div>
    </WholeScreen>
  );
};
export default Home;
