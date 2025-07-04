/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Redo2Icon, Undo2Icon } from "lucide-react";
import { Dispatch, ReactElement, SetStateAction } from "react";

import getClassNameFactory from "../../lib/get-class-name-factory";
import { PuckAction } from "../../reducer";
import type { AppState, Data } from "../../types";
import { IconButton } from "../IconButton/IconButton";
import { useAppContext } from "../Puck/context";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("MenuBar", styles);

export function MenuBar<UserData extends Data>({
  appState,
  dispatch,
  menuOpen = false,
  onPublish,
  renderHeaderActions,
  setMenuOpen,
}: {
  appState: AppState<UserData>;
  dispatch: (action: PuckAction) => void;
  onPublish?: (data: UserData) => void;
  menuOpen: boolean;
  renderHeaderActions?: (props: {
    state: AppState<UserData>;
    dispatch: (action: PuckAction) => void;
  }) => ReactElement;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  // console.log("text and remove this LayerTree",onPublish)

  const {
    history: { back, forward, historyStore },
  } = useAppContext();

  const { hasFuture = false, hasPast = false } = historyStore || {};

  return (
    <div
      className={getClassName({ menuOpen })}
      onClick={(event) => {
        const element = event.target as HTMLElement;

        if (window.matchMedia("(min-width: 638px)").matches) {
          return;
        }
        if (
          element.tagName === "A" &&
          element.getAttribute("href")?.startsWith("#")
        ) {
          setMenuOpen(false);
        }
      }}
    >
      <div className={getClassName("inner")}>
        <div className={getClassName("history")}>
          <IconButton title="undo" disabled={!hasPast} onClick={back}>
            <Undo2Icon size={21} />
          </IconButton>
          <IconButton title="redo" disabled={!hasFuture} onClick={forward}>
            <Redo2Icon size={21} />
          </IconButton>
        </div>
        <>
          {renderHeaderActions &&
            renderHeaderActions({
              state: appState,
              dispatch,
            })}
        </>
      </div>
    </div>
  );
}
