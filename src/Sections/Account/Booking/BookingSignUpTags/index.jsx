"use client"

import BookingSignUpTagsItem from "@/Components/Booking/BookingSignUpTagsItem"
import Container from "@/Components/Container"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateBookingData } from "@/redux/bookingSlice"
import styles from "./BookingSignUpTags.module.scss"
import { takeAvaliableTimesDay } from "./helpers"
import { takeAvaliableTimesToLine } from "./helpers"
import { useSession } from "next-auth/react"

const findIndexByValue = (data, searchValue) => {
  const foundIndex = data.findIndex((item) => item.value === searchValue)
  return foundIndex !== -1 ? foundIndex : false
}

const BookingSignUpTags = ({change = false}) => {
  const { data: sessionData } = useSession();
  const dispatch = useDispatch()
  const { gym, currentDate, visitDate, loading } = useSelector((state) => state.booking)
  const { oldId } = useSelector((state) => state.transfer)
  const [activeTag, setActiveTag] = useState({})
  const [data, setData] = useState([])

  const handleChangeActiveTag = (value) => {
    const index = findIndexByValue(data, value)
    if (data[index]?.value === activeTag.value) return

    if (index > -1) {
      setActiveTag(data[index])
      dispatch(updateBookingData({ loading: true }))

      if(sessionData?.user?.accessToken) {
        if(change) {
          takeAvaliableTimesToLine(sessionData.user.accessToken, oldId, data[index].value)
          .then((data) => {
            dispatch(
              updateBookingData({
                currentDate: index,
                avaliableTimesCurrentDay: data || [],
                loading: false,
              })
            )
          })
        } else {
          takeAvaliableTimesDay(sessionData.user.accessToken, gym?.id, data[index].value)
          .then((data) => {
            dispatch(
              updateBookingData({
                currentDate: index,
                avaliableTimesCurrentDay: data || [],
                loading: false,
              })
            )
          })
        }
      }
    }
  }

  const handleDeleteTag = (value) => {
    if (data.length > 1) {
      const newData = [...data.filter((item) => item.value !== value)]
      setData(newData)
      dispatch(updateBookingData({ visitDate: newData }))
      if (activeTag?.value === value) {
        setActiveTag(newData[0])
        dispatch(updateBookingData({ currentDate: 0 }))
      } else {
        const index = findIndexByValue(newData, activeTag?.value)
        dispatch(updateBookingData({ currentDate: index }))
      }
    }
  }

  useEffect(()=>{
    dispatch(updateBookingData({ loading: true }))
    if(sessionData?.user?.accessToken) {

      if(change) {
        takeAvaliableTimesToLine(sessionData.user.accessToken, oldId, visitDate[currentDate].value)
        .then((data) => {
          dispatch(
            updateBookingData({
              avaliableTimesCurrentDay: data || [],
              loading: false,
            })
          )
        })
      } else {
        takeAvaliableTimesDay(sessionData.user.accessToken, gym?.id, visitDate[currentDate].value)
        .then((data) => {
          dispatch(
            updateBookingData({
              avaliableTimesCurrentDay: data || [],
              loading: false,
            })
          )
        })
      }
    }
  },[currentDate])

  useEffect(() => {
    setData(visitDate)
    let activeTagTemp = null
    if (!!visitDate?.length) {
      if (currentDate) {
        activeTagTemp = visitDate[currentDate]
      } else {
        activeTagTemp = visitDate[0]
      }
    }
    setActiveTag(activeTagTemp)
  }, [visitDate])

  return (
    <section className={styles["booking-sign-up-tags"]}>
      <Container>
        <div className={styles["booking-sign-up-tags__list"]}>
          {data?.map(({ value }, index) => (
            <BookingSignUpTagsItem
              onDelete={handleDeleteTag}
              onClick={handleChangeActiveTag}
              key={index}
              isLonely={data.length === 1}
              isActive={value === activeTag?.value}
              value={value}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default BookingSignUpTags
