import "./index.css";
import { FieldCell } from "./components/Cell";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import { FailedModal } from "./components/FailedModal";
import { v4 as uuid } from "uuid";
import { Score } from "./components/Score";

const ROWS = 10;
const COLUMNS = 10;

const START_SNAKE_POS_X = 4;
const START_SNAKE_POS_Y = 7;

export const START_SNAKE_LENGTH = 3;

enum DirectionsEnum {
  TOP = "TOP",
  RIGHT = "RIGHT",
  BOTTOM = "BOTTOM",
  LEFT = "LEFT",
}

type CoordsType = {
  x: number;
  y: number;
};

function App() {
  const arrayRows = Array.from({ length: ROWS }, () => {});
  const arrayColumns = Array.from({ length: COLUMNS }, () => {});

  const [isFailed, setIsFailed] = useState(false);

  const [snakeLength, setSnakeLength] = useState(START_SNAKE_LENGTH);

  const [applesList, setApplesList] = useState<
    { id: string; x: number; y: number }[]
  >([]);

  const [direction, setDirection] = useState<DirectionsEnum>(
    DirectionsEnum.TOP,
  );

  const [snakeHeadPos, setSnakeHeadPos] = useState({
    x: START_SNAKE_POS_X,
    y: START_SNAKE_POS_Y,
  });

  // const [turnsCoors, setTurnsCoors] = useState<CoordsType[]>([]);

  const snake = useMemo(() => {
    const snakeArray = Array.from({ length: snakeLength }, () => {});

    const snake: CoordsType[] = [];

    for (let i = 0; i < snakeArray.length; i++) {
      if (i === 0) {
        snake.push({ x: snakeHeadPos.x, y: snakeHeadPos.y });
      } else {
        const prevElem = snake[i - 1];

        if (direction === DirectionsEnum.LEFT) {
          snake.push({ x: prevElem.x + 1, y: prevElem.y });
        }
        if (direction === DirectionsEnum.TOP) {
          snake.push({ x: prevElem.x, y: prevElem.y + 1 });
        }
        if (direction === DirectionsEnum.RIGHT) {
          snake.push({ x: prevElem.x - 1, y: prevElem.y });
        }
        if (direction === DirectionsEnum.BOTTOM) {
          snake.push({ x: prevElem.x, y: prevElem.y - 1 });
        }
      }
    }

    return snake;
  }, [snakeHeadPos, direction, snakeLength]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newAppleX = Math.floor(Math.random() * ROWS) + 1;
      const newAppleY = Math.floor(Math.random() * COLUMNS) + 1;

      setApplesList((prevState) => {
        const apple = prevState.find(
          (apple) => apple.y === newAppleY && apple.x === newAppleX,
        );

        if (apple) {
          return prevState;
        }

        return [...prevState, { id: uuid(), x: newAppleX, y: newAppleY }];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnakeHeadPos((prevState) => {
        const updatedPos = { ...prevState };

        switch (direction) {
          case DirectionsEnum.TOP:
            updatedPos.y -= 1;
            break;
          case DirectionsEnum.RIGHT:
            updatedPos.x += 1;
            break;
          case DirectionsEnum.BOTTOM:
            updatedPos.y += 1;
            break;
          case DirectionsEnum.LEFT:
            updatedPos.x -= 1;
            break;
          default:
            updatedPos.y += 1;
        }

        if (
          updatedPos.y === 0 ||
          updatedPos.x === ROWS + 1 ||
          updatedPos.y === COLUMNS + 1 ||
          updatedPos.x === 0
        ) {
          setIsFailed(true);
          clearInterval(intervalId);
        }

        return updatedPos;
      });
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [direction]);

  useEffect(() => {
    document.addEventListener("keyup", (event) => {
      const keyName = event.key;

      if (keyName === "ArrowLeft") {
        setDirection(DirectionsEnum.LEFT);
      }
      if (keyName === "ArrowUp") {
        setDirection(DirectionsEnum.TOP);
      }
      if (keyName === "ArrowRight") {
        setDirection(DirectionsEnum.RIGHT);
      }
      if (keyName === "ArrowDown") {
        setDirection(DirectionsEnum.BOTTOM);
      }
    });
  }, []);

  const eatAppleHandler = useCallback(
    (appleId?: string) => {
      if (appleId) {
        setSnakeLength((prevState) => prevState + 1);
      }
      setApplesList(applesList.filter((apple) => apple.id !== appleId));
    },
    [applesList],
  );

  return (
    <div className={styles.container}>
      <div className={styles.game}>
        <div className={styles.field}>
          {isFailed && <FailedModal />}
          {arrayRows.map((_, yIndex) => {
            return (
              <div className={styles.row} key={yIndex}>
                {arrayColumns.map((_, xIndex) => {
                  const isAnySnakePieceOnThisCell = snake.find(
                    (piece) =>
                      piece?.x === xIndex + 1 && piece?.y === yIndex + 1,
                  );

                  const apple = applesList.find(
                    (apple) => apple.y === yIndex + 1 && apple.x === xIndex + 1,
                  );

                  const isSnakeHeadOnThisCell = snakeHeadPos.x === xIndex + 1 && snakeHeadPos.y === yIndex + 1

                  return (
                    <FieldCell
                      key={xIndex}
                      isSnakeOnThisCell={!!isAnySnakePieceOnThisCell}
                      isSnakeHeadOnThisCell={isSnakeHeadOnThisCell}
                      isAppleOnThisCell={!!apple}
                      eatAppleHandler={() => eatAppleHandler(apple?.id)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <Score score={snakeLength} />
    </div>
  );
}

export default App;
