import styles from "./styles.module.css";
import { START_SNAKE_LENGTH } from "../../App.tsx";

export const Score = ({ score }: { score: number }) => {
  return (
    <div className={styles.score}>Score: {score - START_SNAKE_LENGTH}</div>
  );
};
