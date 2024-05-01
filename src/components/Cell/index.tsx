import styles from "./styles.module.css";

type FieldCellPropsType = {
  isSnakeOnThisCell: boolean;
  isAppleOnThisCell: boolean
};

export const FieldCell = ({ isSnakeOnThisCell,isAppleOnThisCell }: FieldCellPropsType) => {
  return (
    <div
      className={styles.cell}
      style={{ backgroundColor: isSnakeOnThisCell ? "red" : "yellow" }}
    >
      {isAppleOnThisCell && <div className={styles.apple}></div>}
    </div>
  );
};