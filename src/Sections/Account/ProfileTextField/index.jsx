import ProfileBlockTitle from "@/Components/Account/Profile/ProfileBlockTitle"
import ProfileTextFiedBlock from "@/Components/Account/Profile/ProfileTextFiedBlock"
import Container from "@/Components/Container"
import styles from "./ProfileTextField.module.scss"

const ProfileTextField = () => {
  return (
    <section className={styles["profile-text-field"]}>
      <Container size="M">
        <div className={styles["profile-text-field__wrapper"]}>
          <ProfileBlockTitle label={"Обратная связь "} />
          <ProfileTextFiedBlock />
        </div>
      </Container>
    </section>
  )
}

export default ProfileTextField
