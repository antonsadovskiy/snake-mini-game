import styles from './styles.module.css'

export const FailedModal = () => {
    return <div className={styles.modal}>
        <div>you lost</div>
        <button>restart</button>
    </div>
}