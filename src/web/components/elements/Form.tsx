import React from "react";
import { FormProps } from "../../types";

const Form: React.FC<FormProps> = ({
  name,
  method = "post",
  action = "",
  color,
  backgroundColor,
  margin,
  padding,
  className = "",
  tailwindClass,
  puck: { renderDropZone },
}) => {
  const style: React.CSSProperties = {
    color: color || undefined,
    backgroundColor: backgroundColor || undefined,
    margin: margin || undefined,
    padding: padding || undefined,
  };

  const formClass = `form ${className} ${tailwindClass || ""}`.trim();

  return (
    <form
      name={name}
      method={method}
      action={action}
      className={formClass}
      style={style}
    >
      {renderDropZone({
        zone: "content",
        allowedComponents: ["Input"],
      })}
    </form>
  );
};

export default Form;
