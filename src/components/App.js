import { useState, useEffect } from "react";
import api from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import PopupWithConfirmation from "./PopupWithConfirmation.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
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
  }, []);

  useEffect(() => {
    setFormValid(!Object.values(formErrors).some((item) => item !== ""));
  }, [formErrors]);

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
      default:
        console.log(
          "Ошибка! Проверочное поле не совпало ни с одним из условий."
        );
        break;
    }
  };

  const closeAllPopups = (event) => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
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
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
