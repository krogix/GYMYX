'use client';

import BookingTimeVariantsItem from './BookingTimeVariantsItem';
import styles from './BookingTimeVariants.module.scss';
import { useSelector } from 'react-redux';

import { timeToNumber, convertToTimeFormat } from './helpers';
import Loading from '@/Components/Loading';

const BookingTimeVariants = ({ loading, onChangeData, data, variants }) => {
  const { avaliableTimesCurrentDay } = useSelector((state) => state.booking);

  return (
    <div className={styles['booking-time-variants']}>
      {loading && !!variants.length && (
        <div className={styles['booking-time-variants__loading-preview']}>
          <Loading />
        </div>
      )}
      {variants.map(({ start, end, bgColor }, index) => {
        const components = [];
        for (let i = timeToNumber(start); i <= timeToNumber(end); i++) {
          const formatedTime = convertToTimeFormat(i);
          components.push(
            <BookingTimeVariantsItem
              key={`${index}_${i}`}
              isActive={data.includes(formatedTime)}
              disabled={!avaliableTimesCurrentDay?.includes(formatedTime)}
              handleClick={onChangeData}
              value={formatedTime}
              bgColor={bgColor}
            />,
          );
        }
        return components;
      })}
    </div>
  );
};

export default BookingTimeVariants;
