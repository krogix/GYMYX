'use client'

import styles from'./ProfileBalace.module.scss'

import Container from '@/Components/Container'
import Button from '@/Components/Button'
import Link from 'next/link'

import { useSession } from 'next-auth/react'

const ProfileBalace = () => {
  const { data: sessionData } = useSession();
  const balance = sessionData?.user?.balance || 0

  return (
    <Container size='m'>
      <div className={styles.balance}>
        <div className={styles.balance__item}>баланс тренировок: {balance}</div>
        <Link href={'/lk/booking/purchasing-package'}>
          <Button variant="blue-gradient" size="sm" label={'Пополнить'} />
        </Link>
      </div>
    </Container>
  )
}

export default ProfileBalace