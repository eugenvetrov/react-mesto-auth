import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="auth">
      <h1 className="auth__title">Регистрация</h1>
      <form className="auth__form">
        <input
          className="popup__text auth__field"
          name="email"
          placeholder="Email"
        />
        <input
          className="popup__text auth__field"
          name="password"
          placeholder="Пароль"
        />
        <button className="popup__submit auth__submit" type="submit">
          Зарегистрироваться
        </button>
      </form>
      <p className="auth__text">
        Уже зарегестрированы?{" "}
        <Link className="auth__link" to="./sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default Register;
