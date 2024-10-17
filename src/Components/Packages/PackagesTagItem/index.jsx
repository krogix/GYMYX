import styles from './PackagesTagItem.module.scss'

const PackagesTagItem = ({id, name, isActive = false, handlerClick}) => {
  return (
    <button type='button' className={`${styles['packages-tag-item']} ${isActive ? styles['packages-tag-item--active'] : ''}`}
    onClick={() => handlerClick(id)}
    >
      {name}
    </button>
  )
}

export default PackagesTagItem