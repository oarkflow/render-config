import React from "react";

interface ButtonProps {
  label: string;
  variant?: "default" | "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  name?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  className = "",
  name = "",
  onClick,
}) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium";
  const variants = {
    default:
      "bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  };

  const variantStyle = variants[variant];

  // const containerClasses = classNames(className);
  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      onClick={onClick}
      name={name}
    >
      {label}
    </button>
  );
};

export default Button;
