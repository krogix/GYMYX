import styles from "./BookingTimePricingLine.module.scss"
import BookingTimePricingLineItem from "./BookingTimePricingLineItem"

const BookingTimePricingLine = ({ variants }) => {
  return (
    <div className={styles["booking-time-pricing-line"]}>
      {variants.map(({ price, bgColor }) => (
        <BookingTimePricingLineItem
          key={price}
          bgColor={bgColor}
          value={price}
        />
      ))}
    </div>
  )
}

export default BookingTimePricingLine
