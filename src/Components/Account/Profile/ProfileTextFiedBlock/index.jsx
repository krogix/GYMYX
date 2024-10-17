import { sendMessage } from '@/Sections/Account/ProfileTextField/helpers';
import styles from './ProfileTextFiedBlock.module.scss';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const ProfileTextFiedBlock = () => {
  const { data: sessionData } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');

  const handleSendMessage = (text) => {
    if (text !== '') {
      setIsLoading(true);
      sendMessage(sessionData?.user?.accessToken, text).then((data) => {
        if (data.data.message === 'Сообщение доставлено') {
          setText('');
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <div className={styles['profile-textfied-block']}>
      <textarea
        placeholder="Расскажите о плохом и хорошем…"
        className={
          isLoading ? styles['profile-textfied-block__input-disable'] : styles['profile-textfied-block__input']
        }
        onInput={(e) => setText(e.target.value)}
        value={text}
      />
      <button className={styles['profile-textfied-block__btn']} onClick={() => handleSendMessage(text)}>
        <img className={styles['profile-textfied-block__btn-icon']} src="/icons/arrowTextFied.svg" alt="" />
      </button>
    </div>
  );
};

export default ProfileTextFiedBlock;
