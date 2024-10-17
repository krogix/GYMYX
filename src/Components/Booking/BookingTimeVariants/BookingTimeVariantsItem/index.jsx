import styles from "./BookingTimeVariantsItem.module.scss"

const BookingTimeVariantsItem = ({
  handleClick,
  disabled,
  isActive,
  bgColor,
  value,
}) => {
  const handleOnClick = () => {
    handleClick(value)
  }

  return (
    <div
      disabled
      onClick={handleOnClick}
      style={{ "--var-bg": bgColor }}
      className={`${styles["booking-time-variants-item"]} ${
        isActive ? styles["active"] : ""
      } ${disabled ? styles["disabled"] : ""}`}
    >
      {value}
    </div>
  )
}

export default BookingTimeVariantsItem
