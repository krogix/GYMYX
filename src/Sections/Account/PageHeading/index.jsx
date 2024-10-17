import Container from '@/Components/Container';
import styles from './PageHeading.module.scss';

const PageHeading = ({ title, container = true }) => {
  return (
    <section className={styles['page-heading']}>
      {container ? (
        <Container>
          <div className={styles['page-heading__wrapper']}>
            <p className={styles['page-heading__title']}>{title}</p>
          </div>
        </Container>
      ) : (
        <div className={styles['page-heading__wrapper']}>
          <p className={styles['page-heading__title']}>{title}</p>
        </div>
      )}
    </section>
  );
};

export default PageHeading;
