import { useState } from 'react';
import styles from './GidItemContent.module.scss';

const GidItemContent = ({ duration, link, title, lock, isViewed, video_poster, onClickFavorite, onClickVideo }) => {
  const [isPlayed, setIsPlayed] = useState(false);
  const handleClickPlay = () => {
    setIsPlayed((prev) => !prev);
    onClickVideo();
  };

  return (
    <div className={styles['gid-item-content']}>
      <div className={styles['gid-item-content__bg']}>
        <img src={video_poster} alt="grid item image" />
      </div>
      {isPlayed && <iframe className={styles['gid-item-content__video']} src={link} />}
      {!isPlayed && <p className={styles['gid-item-content__time']}>{duration}</p>}
      {!isPlayed && (
        <button onClick={handleClickPlay} className={styles['gid-item-content__btn']}>
          <img src="/icons/play.svg" alt="play icon button" />
        </button>
      )}
      <button
        className={`${styles['gid-item-content__btn-lock']} ${lock ? styles['active'] : ''}`}
        onClick={onClickFavorite}
      >
        <img src="/icons/key.svg" alt="lock  icon button" />
        <span className={styles['gid-item-content__btn-span']}>{lock ? 'Закреплено' : 'Закрепить'}</span>
      </button>
      <div className={styles['gid-item-content__about']}>
        <p className={styles['gid-item-content__title']}>{title}</p>
        {isViewed && (
          <p className={styles['gid-item-content__status']}>
            <span className={styles['gid-item-content__status-icon']}>
              {isViewed && <img src="/icons/confirm.svg" alt="confirm icon" />}
            </span>
            <span className={styles['gid-item-content__status-text']}>просмотрено</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default GidItemContent;
