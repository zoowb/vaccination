import Logo from "./image/logo.png";
import AuthBtnSet from "../components/header/authBtn";
import MenuBtnSet from "../components/header/menuBtn";
import "./header.css";

const Header = () => {
  return (
    <div className={"layout"}>
      <header className={"header"}>
        <div className={"contents"}>
          <a href="/">
            <img className={"img"} src={Logo} alt="logo" />
          </a>
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
    </div>
  );
};

export default Header;
