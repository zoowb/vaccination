import "./mypageWhole.css";
import Header from "../header/header";
const MyPageWhole = ({ children }) => {
  return (
    <section className="mypageWhole">
      <Header />
      {children}
    </section>
  );
};

export default MyPageWhole;
