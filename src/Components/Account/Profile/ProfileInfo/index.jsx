import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from './ProfileInfo.module.scss';

const ProfileInfo = () => {
  const session = useSession();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData({
      name: session?.data?.user?.full_name?.split(' ')[0] || '',
      lastname: session?.data?.user?.full_name?.split(' ')[1] || '',
      image: session?.data?.user?.image || '',
      enter_code: session?.data?.user?.enter_code || null,
      is_active_enter_code: session?.data?.user?.is_active_enter_code || null,
    });
  }, [session]);

  return (
    <div className={styles['profile-info']}>
      <div className={styles['profile-info__avatar']}>
        <img className={styles['profile-info__img']} src={userData.image || '/icons/account.svg'} alt="image profile" />
      </div>
      <div className={styles['profile-info__content']}>
        <p className={styles['profile-info__title']}>
          <span>{userData.name}</span>
          <span>{userData.lastname}</span>
        </p>
        {userData.enter_code && (
          <div className={`${styles['profile-info__code']}`}>
            <p className={styles['profile-info__code-text']}>код доступа</p>
            <p
              className={`${styles['profile-info__code-value']} ${
                userData?.is_active_enter_code ? styles['active'] : ''
              }`}
            >
              {userData.enter_code}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfileInfo;
