import Logo from "../../pages/image/logo.svg";
import AuthBtnSet from "./authBtn";
import MenuBtnSet from "./menuBtn";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="contents">
        <Link to={"/home"}>
          <img className="img" src={Logo} alt="logo" />
        </Link>
        <MenuBtnSet
          text1={"접종예약"}
          url1={"/reservation"}
          text2={"기관조회"}
          url2={"/lookup"}
          text3={"간편조회"}
          url3={"/simple"}
        />
        <AuthBtnSet
          text1={"로그인"}
          url1={"/login"}
          text2={"회원가입"}
          url2={"/signup"}
        />
      </div>
    </header>
  );
};

export default Header;
