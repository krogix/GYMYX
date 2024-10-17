'use client';

import PageHeading from '@/Sections/Account/PageHeading';
import NavigationTabs from '@/Sections/Account/NavigationTabs';
import GidList from '@/Sections/Account/Gid/GidList';
import { useState, useEffect, useRef } from 'react';
import Loading from '@/Components/Loading';
import Container from '@/Components/Container';
import { useSession } from 'next-auth/react';

export const getGids = async (token) => {
  const result = await fetch('/api/gids/get-gids', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  const response = await result.json();
  if (!response.error) {
    return response;
  }
};

const Gid = () => {
  const [tags, setTags] = useState([]);
  const { data: sessionData } = useSession();
  const [activeTag, setActiveTag] = useState(null);
  const [renderedItems, setRenderedItems] = useState([]);
  const [gids, setGids] = useState([]);
  const [loading, setLoading] = useState(true);
  const firstInit = useRef(false);

  useEffect(() => {
    if (!sessionData?.user?.accessToken) return;
    if (firstInit.current) return;
    firstInit.current = true;
    setLoading(true);
    getGids(sessionData?.user?.accessToken).then(({ data }) => {
      if (data) {
        const sortedData = data.slice().sort((a, b) => (b.isFavorited ? 1 : -1) - (a.isFavorited ? 1 : -1));
        setGids(sortedData.reverse());
      }
      setLoading(false);
    });
  }, [sessionData]);

  const updateData = (id = -1) => {
    if (id > -1) {
      const findedIndex = gids.findIndex((item) => item.id === id);
      const tempGids = [...gids];

      tempGids[findedIndex].isFavorited = !tempGids[findedIndex].isFavorited;

      tempGids.sort((a, b) => {
        if (a.isFavorited && !b.isFavorited) {
          return -1;
        } else if (!a.isFavorited && b.isFavorited) {
          return 1;
        } else {
          return b.id - a.id;
        }
      });

      setGids(tempGids);
    }
  };

  useEffect(() => {
    const uniqueTags = [];

    gids.forEach(({ tags }) => {
      tags.forEach((tag) => {
        uniqueTags[tag] = { title: tag };
      });
    });

    const uniqueTagsArray = Object.values(uniqueTags);
    setTags(uniqueTagsArray);
  }, [gids]);

  useEffect(() => {
    if (activeTag !== null) {
      const tag = tags[activeTag];

      const resultItems = gids.filter((item) => item.tags.includes(tag.title));

      setRenderedItems(resultItems);
    } else {
      setRenderedItems(gids);
    }
  }, [activeTag, tags, gids]);

  const handleChangeTag = (index) => {
    if (activeTag === null) {
      setActiveTag(index);
    } else {
      setActiveTag(index === activeTag ? null : index);
    }
  };

  if (loading) return <Loading full_screen={true} />;
  return (
    <div className="account-page-wrapper">
      <PageHeading title={'Онлайн гид'} />
      {!!gids?.length ? (
        <>
          <NavigationTabs items={tags} selectedTab={activeTag} handleChangeTab={handleChangeTag} itemIcon={null} />
          <GidList items={!!renderedItems?.length ? renderedItems : gids} updateData={updateData} />
        </>
      ) : (
        <Container>
          <p style={{ color: 'white' }}>{'Пока что здесь пусто :('}</p>
        </Container>
      )}
    </div>
  );
};

export default Gid;
