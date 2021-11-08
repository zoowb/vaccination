import "./header.css"
import Logo from "../pages/image/logo.png"
import { Link } from 'react-router-dom';

const Header = ( {children} ) => {
    return (
        <div className={"layout"}>
            <header className={"header"}>
                <div className={"contents"}>
                    <img className={"img"} src={Logo} alt="logo" />

                    <nav className={"navigation"}>
                        <ul className={"ul"}>
                            <li className={"menu"}>
                                <Link to="/reservation" style={{textDecoration: 'none'}}>
                                    <h2>접종예약</h2>
                                </Link>
                            </li>
                            <li className={"menu"}>
                                <Link to="/lookUp" style={{textDecoration: 'none'}}>
                                    <h2>기관조회</h2>
                                </Link>
                            </li>
                            <li className={"menu"}>
                                <Link to="/simple" style={{textDecoration: 'none'}}>
                                    <h2>간편조회</h2>
                                </Link>
                            </li>
                            <li className={"log"}>
                                <Link to="/login" style={{textDecoration: 'none'}}>
                                    로그인/회원가입
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}

export default Header