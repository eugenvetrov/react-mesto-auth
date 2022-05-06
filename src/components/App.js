import { useState, useEffect } from "react";
import { api, auth } from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import PopupWithConfirmation from "./PopupWithConfirmation.js";
import ProtectedRoute from "./ProtectedRoute.js";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoToolTip from "./InfoToolTip.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardForDelete, setCardForDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [formErrors, setFormErrors] = useState({
    name: "",
    about: "",
    link: "",
    avatar: "",
  });
  const [formValid, setFormValid] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [isAuthSuccesfull, setIsAuthSuccesfull] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    api
      .getUserInfo()
      .then((user) => setCurrentUser(user))
      .catch((error) => console.log(error));

    api
      .getCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });

    tokenCheck();
  }, []);

  useEffect(() => {
    setFormValid(!Object.values(formErrors).some((item) => item !== ""));
  }, [formErrors]);

  useEffect(() => {
    tokenCheck();
  }, [localStorage.getItem("jwt")]);

  const clearErrors = () => {
    for (let key in formErrors) {
      setFormErrors((prev) => ({
        ...prev,
        [key]: "",
      }));
    }
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
    clearErrors();
    setFormValid(false);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
    clearErrors();
    setFormValid(false);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
    clearErrors();
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    const request = isLiked
      ? api.deleteLikeCard(card._id)
      : api.putLikeCard(card._id);
    request
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    setCardForDelete(card);
    setIsDeleteCardPopupOpen(true);
  }

  function handleDeleteCard(event) {
    event.preventDefault();
    api
      .deleteCard(cardForDelete)
      .then(() => {
        setCards(cards.filter((c) => c != cardForDelete));
      })
      .then(setIsDeleteCardPopupOpen(false))
      .catch((err) => {
        console.log(err);
      });
  }

  const handleUpdateUser = (user) => {
    api
      .setUserInfo(user.name, user.about)
      .then((user) => {
        setCurrentUser(user);
        setIsEditProfilePopupOpen(false);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateAvatar = (link) => {
    api
      .changeAvatar(link.avatar)
      .then((user) => {
        setCurrentUser(user);
        setIsEditAvatarPopupOpen(false);
      })
      .catch((error) => console.log(error));
  };

  const handleAddPlace = (card) => {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((error) => console.log(error));
  };

  const showAuthOk = () => {
    setIsAuthSuccesfull(true);
    setIsInfoToolTipOpen(true);
  };

  const showAuthError = () => {
    setIsAuthSuccesfull(false);
    setIsInfoToolTipOpen(true);
  };

  const handleLogin = (user) => {
    auth
      .authorize(user)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          setLoggedIn(true);
          navigate("/");
        } else {
          console.log("Неизвестная ошибка");
        }
      })
      .then(() => {
        tokenCheck();
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 400) {
          console.log("не передано одно из полей");
          return;
        } else if (err.status === 401) {
          console.log("пользователь с email не найден");
          return;
        } else {
          console.log("Неизвестная ошибка");
          return;
        }
      });
  };

  const handleRegister = (user) => {
    auth
      .register(user)
      .then((res) => {
        setEmail(res.data.email);
        showAuthOk();
        navigate("/sign-in");
      })
      .catch((err) => {
        console.log(err);
        showAuthError();
        if (err.status === 400) {
          console.log("некорректно заполнено одно из полей");
          return;
        } else {
          console.log("Неизвестная ошибка");
        }
      });
  };

  const tokenCheck = () => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      auth
        .validateUser(jwt)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          navigate("/");
        })
        .catch((err) => {
          if (err.status === 400) {
            console.log("Токен не передан или передан не в том формате");
          } else if (err.status === 401) {
            console.log("Переданный токен некорректен");
          }
          console.log(err);
        });
    } else {
      setLoggedIn(false);
      setEmail("");
    }
  };

  const validateField = (field, value) => {
    if (value == 0) setFormValid(false);
    switch (field) {
      case "name":
        if (value.length >= 2 && value.length <= 40) {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "",
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "Недопустимое количество символов",
          }));
        }
        break;
      case "about":
        if (value.length >= 2 && value.length <= 40) {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "",
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "Недопустимое количество символов",
          }));
        }
        break;
      case "link":
        if (value.match(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/i)) {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "",
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "Пожалуйста, введите ссылку на изображение",
          }));
        }
        break;
      case "avatar":
        if (value.match(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/i)) {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "",
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "Пожалуйста, введите ссылку на изображение",
          }));
        }
        break;
      case "email":
        if (value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "",
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "Пожалуйста, введите корректный email",
          }));
        }
        break;
      case "password":
        if (
          value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i)
        ) {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "",
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            [field]: "Пожалуйста, введите более сложный пароль",
          }));
        }
        break;
      default:
        console.log(
          "Ошибка! Проверочное поле не совпало ни с одним из условий."
        );
        break;
    }
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header loggedIn={loggedIn} email={email} />
        <Routes>
          <Route
            path="/sign-in"
            element={
              <Login
                onLogin={handleLogin}
                formErrors={formErrors}
                validateField={validateField}
                formValid={formValid}
              />
            }
          />
          <Route
            path="/sign-up"
            element={
              <Register
                onRegister={handleRegister}
                formErrors={formErrors}
                validateField={validateField}
                formValid={formValid}
              />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn} redirectTo={"./sign-in"}>
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              loggedIn ? <Navigate to={"/"} /> : <Navigate to={"./sign-in"} />
            }
          />
        </Routes>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          formErrors={formErrors}
          validateField={validateField}
          formValid={formValid}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          formErrors={formErrors}
          validateField={validateField}
          formValid={formValid}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaces={handleAddPlace}
          formErrors={formErrors}
          validateField={validateField}
          formValid={formValid}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <PopupWithConfirmation
          title="Вы уверены?"
          name="popup_delete-card"
          submitValue="Да"
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleDeleteCard}
        />

        <InfoToolTip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          isAuthSuccesfull={isAuthSuccesfull}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
