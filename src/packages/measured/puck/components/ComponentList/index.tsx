import styles from "./styles.module.css";
import getClassNameFactory from "../../lib/get-class-name-factory";
import { ReactNode } from "react";
import { useAppContext } from "../Puck/context";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Drawer } from "../Drawer";

const getClassName = getClassNameFactory("ComponentList", styles);

const ComponentListItem = ({
  name,
  label,
}: {
  name: string;
  label?: string;
  index?: number; 
}) => {
  const { overrides, getPermissions } = useAppContext();

  const canInsert = getPermissions({
    type: name,
  }).insert;

  return (
    <Drawer.Item label={label} name={name} isDragDisabled={!canInsert}>
      {overrides.componentItem}
    </Drawer.Item>
  );
};

const ComponentList = ({
  children,
  title,
  id,
}: {
  id: string;
  children?: ReactNode;
  title?: string;
}) => {
  const { config, state, setUi } = useAppContext();

  const { expanded = true } = state.ui.componentList[id] || {};

  return (
    <div className={getClassName({ isExpanded: expanded })}>
      {title && (
        <button
          type="button"
          className={getClassName("title")}
          onClick={() =>
            setUi({
              componentList: {
                ...state.ui.componentList,
                [id]: {
                  ...state.ui.componentList[id],
                  expanded: !expanded,
                },
              },
            })
          }
          title={
            expanded
              ? `Collapse${title ? ` ${title}` : ""}`
              : `Expand${title ? ` ${title}` : ""}`
          }
        >
          <div>{title}</div>
          <div className={getClassName("titleIcon")}>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </button>
      )}
      <div className={getClassName("content")}>
        <Drawer>
          {children ||
            Object.keys(config.components).map((componentKey) => {
              return (
                <ComponentListItem
                  key={componentKey}
                  label={
                    config.components[componentKey]["label"] ?? componentKey
                  }
                  name={componentKey}
                />
              );
            })}
        </Drawer>
      </div>
    </div>
  );
};

ComponentList.Item = ComponentListItem;

export { ComponentList };
