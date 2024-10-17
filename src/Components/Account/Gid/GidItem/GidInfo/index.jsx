import styles from './GidInfo.module.scss';

const GidInfo = ({ description, trainingTime }) => {
  return (
    <div className={styles['gid-item-info']}>
      <div className={styles['gid-item-info__item']}>
        <p className={styles['gid-item-info__item-text']}>{description}</p>
      </div>
      <div className={styles['gid-item-info__item']}>
        <div className={styles['gid-item-info__item-tag']}>тренировка</div>
        <p className={styles['gid-item-info__item-text']}>{trainingTime}</p>
      </div>
    </div>
  );
};

export default GidInfo;
