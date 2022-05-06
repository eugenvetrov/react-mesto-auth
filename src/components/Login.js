function Login() {
  return (
    <div className="auth">
      <h1 className="auth__title">Вход</h1>
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
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
