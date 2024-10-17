import ProfileBlockTitle from '@/Components/Account/Profile/ProfileBlockTitle';

import styles from './ProfileContacts.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ProfileContacts = () => {
  const [labelText, setLabelText] = useState('Связаться с нами');

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    setLabelText(isMobile ? 'Контакты' : 'Связаться с нами');
  }, []);

  return (
    <section className={styles['profile-contacts']}>
      <div className={styles['profile-contacts__wrapper']}>
        <ProfileBlockTitle label={labelText} />
        <div className={styles['profile-contacts__elements']}>
          <div className={styles['profile-contacts__element']}>
            <p className={styles['profile-contacts__element-label']}>Телефон</p>
            <a href="tel:+79014240024" className={styles['profile-contacts__element-text']}>
              +7 (901) 424 00 24
            </a>
          </div>
          <div className={styles['profile-contacts__element']}>
            <p className={styles['profile-contacts__element-label']}>Соцсети</p>
            <div className={styles['profile-contacts__socials']}>
              <Link
                href="https://wa.me/+79014240024"
                target="blank"
                className={styles['profile-contacts__socials-item']}
              >
                <img src="/icons/socials/whatsapp.svg" alt="" />
              </Link>
              <Link href="https://t.me/helpgymyx" target="blank" className={styles['profile-contacts__socials-item']}>
                <img src="/icons/socials/telegram.svg" alt="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileContacts;
