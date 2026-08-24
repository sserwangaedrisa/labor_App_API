import React, { type JSX } from "react";
import { Link } from "react-router-dom";
import { openRequestModal } from "../../../lib/requestModal";

const VARIANTS = {
  primary:
    "bg-amber text-onyx hover:bg-amber/90 border-2 border-white rounded-full shadow-[4px_4px_0_0_hsl(var(--onyx))]",
  dark: "bg-onyx text-titanium hover:bg-onyx/90 border border-onyx",
  outline:
    "bg-transparent text-onyx border border-onyx hover:bg-onyx hover:text-titanium",
  ghostLight:
    "bg-transparent text-titanium border border-titanium/40 hover:bg-titanium hover:text-onyx",
} as const;

type ButtonVariant = keyof typeof VARIANTS;

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  to?: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  to,
  href,
  onClick,
  className = "",
  type = "button",
}): JSX.Element => {
  const base =
    "mechanical-hover inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold uppercase tracking-wider cursor-pointer select-none";

  const cls = `${base} ${VARIANTS[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
};

interface RequestButtonProps {
  label?: string;
  variant?: ButtonVariant;
  className?: string;
}

export const RequestButton: React.FC<RequestButtonProps> = ({
  label = "Request Manpower",
  variant = "primary",
  className = "bg-orange-500/50 hover:bg-orange-300",
}): JSX.Element => {
  return (
    <Button variant={variant} onClick={openRequestModal} className={className}>
      {label}
      <span className="text-base leading-none">→</span>
    </Button>
  );
};

export default Button;
