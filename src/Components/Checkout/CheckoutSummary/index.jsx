'use client';

import Button from '@/Components/Button';
import styles from './CheckoutSummary.module.scss';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { findPrice, createBooking, countValues, prepareDataForBooking, fun, sortByDate } from './helpers';
import CheckoutConfirm from '@/Components/Checkout/CheckoutConfirm';
import Modal from '@/Components/Modal';

const CheckoutSummary = ({ items, gym, isActivePackage = 0 }) => {
  const router = useRouter();
  const { data: sessionData, update } = useSession();
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);
  const [finalArr, setFinalArr] = useState([]);
  const [isFirstBooking, setIsFirstBooking] = useState();
  const [modalData, setModalData] = useState({
    type: '', // successful, confirm, crowded
    isShow: false,
    text: '',
  })
  const balance = sessionData?.user?.balance || 0
  const [paidData, setPaidData] = useState({})
  const [isLoad, setIsLoad] = useState(false)

  const totalPrice = useMemo(() => {
    let total = 0;

    items.forEach((entry, indexFirst) => {
      entry.time.map((time, indexSecond) => {
        if (isFirstBooking && indexFirst === 0 && indexSecond === 0) {
          total += gym.min_price;
        } else {
          total += findPrice(time, gym?.prices);
        }
      });
    });
    setList(sortByDate(countValues(items, gym?.prices)));
    return total;
  }, [isFirstBooking, items, gym]);

  const sortArr = () => {
    const tmpArr = list.reduce((acc, el) => {
      if (isFirstBooking) {
        list[0].price = gym.min_price;
      }
      const existingEl = acc.find((item) => item.price === el.price);

      if (existingEl) {
        existingEl.count += el.count;
      } else {
        acc.push({ ...el, count: el.count });
      }
      return acc;
    }, []);

    setFinalArr(tmpArr);
  };

  const handleSubmit = () => {
    setLoading(true);
    createBooking(sessionData.user.accessToken, gym?.id, false, prepareDataForBooking(list))
    .then(({ data }) => {
      if (data?.payment_link) router.push(data?.payment_link);
      else if (data?.status) router.push('/lk/training');
      else setError(true);
      setLoading(false);
    });
  };

  const handlerClicktByBalance = () => {
    setPaidData(fun(list, balance, gym.min_price))
    const countTrainint = finalArr.reduce((acc, el) => acc + (el?.count || 0), 0)

    if(countTrainint <= balance) setModal('confirm')
    else setModal('crowded')
  }

  const setModal = (type) => {
    if(type == 'confirm') {
      const countTrainint = finalArr.reduce((acc, el) => acc + (el?.count || 0), 0)
      const text = countTrainint == 1 
      ? 'тренировку' 
      : countTrainint > 1 && countTrainint <= 4 
      ? 'тренировки' 
      : 'тренировок'
      setModalData(prev => ({
        ...prev,
        type: 'confirm',
        isShow: true,
        text: `Списать ${countTrainint} ${text} с баланса?`,
      }))
    } else if(type == 'crowded') {
      setModalData(prev => ({
        ...prev,
        type: 'crowded',
        isShow: true,
        text: '',
      }))
    } else if(type == 'successful') {
      setModalData(prev => ({
        ...prev,
        type: 'successful',
        isShow: true,
        text: 'Спасибо за покупку!',
      }))
    } else if(type == 'close') {
      setModalData(prev => ({
        ...prev,
        type: '',
        isShow: false,
        text: '',
      }))
    }
  }

  const closeModal = () => {
    setModalData(prev => ({
      ...prev,
      isShow: false,
    }))
  }

  useEffect(() => {
    if (sessionData?.user) {
      setIsFirstBooking(sessionData?.user?.is_new);
      sortArr();
      setLoadingPage(false);
    }
  }, [sessionData, isFirstBooking, list]);

  if (loadingPage) return;

  return (
    <>
    {modalData.isShow && sessionData && (
      <Modal 
      text={modalData.text} 
      handleClose={modalData.type == 'successful' ? ()=>{} : closeModal} 
      size={modalData.type == 'crowded' ? 'xl' : ''}>
        {ModalInner(modalData.type, sessionData.user.accessToken, gym, paidData, setModal, isLoad, setIsLoad, list)}
      </Modal>
    )}
    
    <div className={styles['checkout-summary']}>
      <div className={styles['checkout-summary__wrapper']}>
        <div className={styles['checkout-summary__list']}>
          {finalArr.map(({ value, count, price }, index) => (
            <div key={`${value}_${index}`} className={styles['checkout-summary__item']}>
              <p>Тренировка {price} ₽/ч ({count})</p>
              <p>{price} ₽</p>
            </div>
          ))}
        </div>
        <div className={styles['checkout-summary__summary']}>
          <p>Итого</p>
          <p>{totalPrice} ₽</p>
        </div>
        <div className={styles['checkout-summary__buttons']}>
          <Button
            onClick={handleSubmit}
            size="l"
            variant="blue-gradient"
            fullSize={true}
            label={!loading ? 'Оплатить' : 'Ожидание'}
            icon={!loading ? 'arrow' : null}
            disabled={!canSubmit || loading}
            disabledShadow={true}
          />
        {isActivePackage && (
          <Button
            onClick={handlerClicktByBalance}
            size="l"
            variant="light-blue-gradient"
            fullSize={true}
            label={!loading ? 'Списать с баланса' : 'Ожидание'}
            icon={!loading ? 'arrow' : null}
            disabled={!canSubmit || loading}
            disabledShadow={true}
          />
        )}
        </div>
        
        <CheckoutConfirm handleChangeCanSubmit={() => setCanSubmit((prev) => !prev)} isActive={canSubmit} />
        {error && <p className={styles['checkout-summary__summary-error']}>Произошла ошибка</p>}
      </div>
    </div>
    </>
  );
};

export default CheckoutSummary;


function ModalInner(type, token, gym, trainingsObj, setModal, isLoad, setIsLoad, list) {
  const router = useRouter()
  const totalPrice = trainingsObj.not_paid.reduce((acc, el) => acc + el.price * el.count, 0)

  const goToWorcouts = () => {
    router.push('/lk/workouts')
  }

  const paymentFullByBalance = () => {
    setIsLoad(true)
    createBooking(token, gym?.id, true, prepareDataForBooking(list))
    .then((res) => {
      if(res?.data?.payment_link) {
        setModal('successful')
      }
    })
    .finally(() => {
      setIsLoad(false)
    })
  } 

  const partialPayment = () => {
    setIsLoad(true)
    createBooking(token, gym?.id, true, prepareDataForBooking(list))
    .then((res) => {
      if(res?.data?.payment_link) {
        router.push(res?.data?.payment_link)
      }
      setIsLoad(false)
    })
  }

  const closeModal = () => {
    setModal('close')
  }

  return (
    <>
    {type == 'successful' && (
      <Button
        onClick={goToWorcouts}
        size="l"
        variant="blue-gradient"
        fullSize={true}
        label={'К тренировкам'}
        disabledShadow={true}
      />
    )}

    {type == 'confirm' && (
      <div className={styles['modal-inner']}>
        <div className={styles['modal-inner__buttons']}>
          <Button
            onClick={paymentFullByBalance}
            size="l"
            variant="blue-gradient"
            fullSize={true}
            label={'Да'}
            disabledShadow={true}
            disabled={isLoad}
          />
          <Button
            onClick={closeModal}
            size="l"
            variant="black-gradient"
            fullSize={true}
            label={'Нет'}
            disabledShadow={true}
          />
        </div>
      </div>
    )}

    {type === 'crowded' && (
      <div className={styles['modal-inner']}>
        <div className={styles['modal-inner__header']}>
          <p className={styles['modal-inner__header-title']}>Недостаточно слотов</p>
          <button className={styles['modal-inner__header-icon']} type='button' onClick={closeModal}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 32" fill="none">
              <path d="M32.0002 0.783203L1.56592 31.2176M1.56445 0.783203L31.9988 31.2176" stroke="#212428" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div className={styles['modal-inner__list']}>
          {trainingsObj?.paid && trainingsObj.paid.map(({count, price }, index) => (
            <div key={`${index}`} className={`${styles['modal-inner__list-item']} ${styles['modal-inner__list-item--paid']}`}>
              <p>Тренировка {price} ₽/ч ({count})</p>
              <p>{price} ₽</p>
            </div>
          ))}
          {trainingsObj?.not_paid && trainingsObj.not_paid.map(({count, price }, index) => (
            <div key={`${index}`} className={styles['modal-inner__list-item']}>
              <p>Тренировка {price} ₽/ч ({count})</p>
              <p>{price} ₽</p>
            </div>
          ))}
        </div>
        <div className={styles['modal-inner__summary']}>
          <span className={styles['modal-inner__summary-text']}>Итого</span>
          <span className={styles['modal-inner__summary-price']}>{totalPrice} ₽</span>
        </div>
        <div className={styles['modal-inner__buttons']}>
          <Button
            onClick={partialPayment}
            size="l"
            variant="blue-gradient"
            fullSize={true}
            icon={'arrow'}
            label={'Оплатить'}
            disabledShadow={true}
            disabled={isLoad}
          />
        </div>
      </div>
    )}
    </>
  )
}
