import GidItem from '@/Components/Account/Gid/GidItem';
import Container from '@/Components/Container';

import styles from './GidList.module.scss';
import { useSession } from 'next-auth/react';

import { addFavoriteExerciser, deleteFavoriteExerciser, addWatchedExerciser } from './helpers';
import { useState } from 'react';

const GidList = ({ items = [], updateData }) => {
  const { data: sessionData } = useSession();
  const [favoriteArray, favoriteItems] = useState([]);

  const handleToggleFavorite = (id, isFavorited) => {
    if (isFavorited) {
      deleteFavoriteExerciser(sessionData?.user?.accessToken, id).then((data) => {
        updateData(id);
      });
    } else {
      addFavoriteExerciser(sessionData?.user?.accessToken, id).then((data) => {
        updateData(id);
      });
    }
  };

  const handleClickWatched = (id) => {
    addWatchedExerciser(sessionData?.user?.accessToken, id);
  };

  return (
    <section className={styles['grid-list']}>
      <Container>
        <div className={styles['grid-list__wrapper']}>
          {items.map(({ tags, id, ...rest }) => (
            <GidItem
              key={id}
              {...rest}
              onClickFavorite={() => handleToggleFavorite(id, rest.isFavorited)}
              onClickVideo={() => handleClickWatched(id)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default GidList;
