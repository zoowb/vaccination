import "./menuBtn.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import EasyCheck from "../home/easyCheck";
const MenuBtn = ({ text, url }) => {
  const [modalOn, setModalOn] = useState(false);
  const onOpenModal = () => {
    setModalOn(!modalOn);
  };

  const Modal = () => {
      return(
        <div className="easymodal">
          <div className="easybg"></div>
          <EasyCheck />
        </div>
      );
  };
  return (
    <>
    {text == "간편조회" ?
      <>
      {modalOn && <Modal onOpenModal={onOpenModal}></Modal>}
      <div className="menuBtn-link">
        <h2 className="menuBtn-text" onClick={onOpenModal}>{text}</h2>
      </div>
      </>
      :
      <Link to={url} className="menuBtn-link">
      <h2 className="menuBtn-text">{text}</h2>
    </Link>
  }
  </>
  );
};

const MenuBtnSet = ({ text1, url1, text2, url2, text3, url3 }) => {
  return (
    <div className="menuBtnSet">
      <MenuBtn text={text1} url={url1} />
      <MenuBtn text={text2} url={url2} />
      {text3 && url3 ? <MenuBtn text={text3} url={url3} /> : <></>}
    </div>
  );
};
export default MenuBtnSet;
