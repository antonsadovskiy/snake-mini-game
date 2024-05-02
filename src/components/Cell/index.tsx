import styles from "./styles.module.css";
import { useEffect } from "react";
import applePNG from "../../assets/apple.png";
import snakeHeadPNG from "../../assets/snake_head.png";

type FieldCellPropsType = {
  isSnakeOnThisCell: boolean;
  isAppleOnThisCell: boolean;
  isSnakeHeadOnThisCell: boolean;
  eatAppleHandler: () => void;
};

export const FieldCell = ({
  isSnakeOnThisCell,
  isAppleOnThisCell,
  isSnakeHeadOnThisCell,
  eatAppleHandler,
}: FieldCellPropsType) => {
  useEffect(() => {
    if (isAppleOnThisCell && isSnakeHeadOnThisCell) {
      eatAppleHandler();
    }
  }, [eatAppleHandler, isAppleOnThisCell, isSnakeHeadOnThisCell]);

  return (
    <div
      className={styles.cell}
      style={{ backgroundColor: isSnakeOnThisCell ? "green" : "yellow" }}
    >
      {isSnakeHeadOnThisCell && (
        <img
          className={styles.snakeHead}
          src={snakeHeadPNG}
          alt={"snake_head"}
        />
      )}
      {isAppleOnThisCell && (
        <img className={styles.apple} src={applePNG} alt={"apple"} />
      )}
    </div>
  );
};
