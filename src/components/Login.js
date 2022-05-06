import { useState } from "react";

function Login(props) {
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
      ? props.onLogin({
          password: values.password,
          email: values.email,
        })
      : alert("Простите! Какое-то из полей заполнено некорректно.");
  }
  return (
    <div className="auth">
      <h1 className="auth__title">Вход</h1>
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
          placeholder="Пароль"
          onChange={handleChange}
        />
        <button className="popup__submit auth__submit" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
