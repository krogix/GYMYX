import ProfileEditHeading from "@/Sections/Account/ProfileEditHeading"
import ProfileEditForm from "@/Sections/Account/ProfileEditForm"

const ProfileEdit = () => {
  return (
    <div className="account-page-wrapper">
      <ProfileEditHeading
        buttonLabel={"Выйти из редактирования"}
        sectionTitle={"Редактирование профиля"}
      />
      <ProfileEditForm />
    </div>
  )
}

export default ProfileEdit
