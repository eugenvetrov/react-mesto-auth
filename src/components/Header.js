import logo from "../images/logo-white.svg";

function Header(props) {
  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="Место Россия логотип" />
    </header>
  );
}

export default Header;
