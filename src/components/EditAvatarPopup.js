import { useRef, useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarInputRef = useRef();
  const [link, setLink] = useState("");

  useEffect(() => {
    avatarInputRef.current.value = "";
  }, [props.isOpen]);

  function handleChange() {
    setLink(avatarInputRef.current.value);
    props.validateField("avatar", link);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      props.formValid &&
      link.match(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/i)
    ) {
      props.onUpdateAvatar({
        avatar: avatarInputRef.current.value,
      });
    } else {
      alert("Простите! Указанная ссылка не является достаточно валидной.");
    }
  }
  return (
    <PopupWithForm
      title="Обновить аватар"
      name="popup_profile-avatar"
      submitValue="Сохранить"
      isOpen={props.isOpen}
      onClose={(e) => props.onClose(e)}
      onSubmit={(e) => handleSubmit(e)}
      formValid={props.formValid}
    >
      <input
        className="popup__text popup__text_profile-avatar"
        id="profile-avatar"
        type="url"
        name="avatar"
        placeholder="Ссылка на аватар"
        required
        ref={avatarInputRef}
        onChange={handleChange}
      />
      <span
        className="popup__error  popup__error_visible"
        id="profile-avatar-error"
      >
        {props.formErrors.avatar}
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
