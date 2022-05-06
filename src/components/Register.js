import { Link } from "react-router-dom";
import { useState } from "react";

function Register(props) {
  const [values, setValues] = useState({
    name: "",
    about: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    props.validateField(name, value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    const isFieldsNotEmpty = Object.values(values).some((item) => item !== "");
    props.formValid && isFieldsNotEmpty
      ? props.onRegister({
          password: values.password,
          email: values.email,
        })
      : alert("Простите! Какое-то из полей заполнено некорректно.");
  }
  return (
    <div className="auth">
      <h1 className="auth__title">Регистрация</h1>
      <form className="auth__form" onSubmit={(e) => handleSubmit(e)}>
        <input
          className="popup__text auth__field"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="popup__text auth__field"
          name="password"
          type="password"
          placeholder="Пароль"
          onChange={handleChange}
        />
        <button className="popup__submit auth__submit" type="submit">
          Зарегистрироваться
        </button>
      </form>
      <p className="auth__text">
        Уже зарегестрированы?{" "}
        <Link className="auth__link" to="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default Register;
