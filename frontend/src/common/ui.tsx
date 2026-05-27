import React, { createContext, useContext, useMemo, useState } from "react";

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

type BasicProps = {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export function Typography({
  as,
  variant,
  color,
  className,
  children,
  ...rest
}: BasicProps & {
  as?: React.ElementType;
  variant?: string;
  color?: string;
}) {
  const Tag = as || (variant?.startsWith("h") ? variant : "p");
  return (
    <Tag
      className={cx(
        color === "white" && "text-white",
        color === "red" && "text-red-500",
        variant === "h1" && "text-4xl font-bold",
        variant === "h2" && "text-3xl font-bold",
        variant === "h3" && "text-2xl font-bold",
        variant === "h4" && "text-xl font-bold",
        variant === "h5" && "text-lg font-semibold",
        variant === "h6" && "text-base font-semibold",
        variant === "small" && "text-sm",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Button({
  variant,
  color,
  fullWidth,
  loading,
  disabled,
  className,
  children,
  ...rest
}: BasicProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "filled" | "outlined" | "text";
    color?: "red" | "blue" | "blue-gray";
    fullWidth?: boolean;
    loading?: boolean;
  }) {
  const isOutlined = variant === "outlined";
  const isText = variant === "text";
  const colorClasses =
    color === "red"
      ? isOutlined
        ? "border-red-500 text-red-500 hover:bg-red-50"
        : "bg-red-600 text-white hover:bg-red-700"
      : color === "blue"
      ? isOutlined
        ? "border-blue-500 text-blue-600 hover:bg-blue-50"
        : "bg-blue-600 text-white hover:bg-blue-700"
      : isOutlined
      ? "border-gray-400 text-gray-700 hover:bg-gray-50"
      : "bg-gray-800 text-white hover:bg-gray-900";

  return (
    <button
      className={cx(
        "rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        fullWidth && "w-full",
        isText && "bg-transparent border border-transparent hover:bg-gray-100",
        isOutlined && "border bg-transparent",
        !isText && !isOutlined && "border border-transparent",
        colorClasses,
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export function Input({
  label,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-gray-700">
      {label ? <span>{label}</span> : null}
      <input
        className={cx(
          "w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          className
        )}
        {...rest}
      />
    </label>
  );
}

export function Card({ className, children, ...rest }: BasicProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("rounded-lg border border-gray-200 bg-white shadow-sm", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: BasicProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("p-4", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: BasicProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("p-4 pt-0", className)} {...rest}>
      {children}
    </div>
  );
}

export function Chip({
  value,
  className,
  color,
}: {
  value: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const bg = color === "amber" || color === "yellow" ? "bg-amber-200 text-amber-900" : "bg-gray-200 text-gray-900";
  return <span className={cx("rounded-full px-2 py-1 text-xs font-semibold", bg, className)}>{value}</span>;
}

export function Avatar({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
  size?: string;
  variant?: string;
}) {
  return <img src={src} alt={alt || "avatar"} className={cx("h-8 w-8 rounded-full object-cover", className)} />;
}

type OverlayCtx = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const OverlayContext = createContext<OverlayCtx | null>(null);

function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("Overlay components must be nested");
  return ctx;
}

export function Menu({
  open,
  handler,
  children,
}: {
  open?: boolean;
  handler?: (value: boolean) => void;
  placement?: string;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = typeof open === "boolean" && typeof handler === "function";
  const state = useMemo(
    () => ({
      open: controlled ? (open as boolean) : internalOpen,
      setOpen: controlled ? (handler as (value: boolean) => void) : setInternalOpen,
    }),
    [controlled, handler, internalOpen, open]
  );
  return <OverlayContext.Provider value={state}>{children}</OverlayContext.Provider>;
}

export function MenuHandler({ children }: { children: React.ReactElement<any> }) {
  const { open, setOpen } = useOverlay();
  const childProps = (children.props || {}) as Record<string, any>;
  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent) => {
      childProps.onClick?.(event);
      setOpen(!open);
    },
  });
}

export function MenuList({ className, children }: BasicProps) {
  const { open } = useOverlay();
  if (!open) return null;
  return <div className={cx("absolute right-0 z-50 mt-2 min-w-44 rounded-md border bg-white p-1 shadow-lg", className)}>{children}</div>;
}

export function MenuItem({
  className,
  children,
  onClick,
}: BasicProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useOverlay();
  return (
    <button
      className={cx("w-full rounded px-2 py-2 text-left text-sm", className)}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      type="button"
    >
      {children}
    </button>
  );
}

export const Popover = Menu;
export const PopoverHandler = MenuHandler;
export function PopoverContent({ className, children }: BasicProps) {
  return <MenuList className={cx("left-0 right-auto", className)}>{children}</MenuList>;
}

export function List({ className, children }: BasicProps) {
  return <div className={cx("space-y-1 p-2", className)}>{children}</div>;
}

export function ListItemPrefix({ className, children }: BasicProps) {
  return <span className={cx("mr-2 inline-flex items-center", className)}>{children}</span>;
}

export function ListItem({
  selected,
  className,
  children,
  ...rest
}: BasicProps & React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }) {
  return (
    <div
      className={cx(
        "flex cursor-pointer items-center rounded-md px-3 py-2 text-white hover:bg-gray-700",
        selected && "bg-gray-700",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Option({
  value,
  children,
}: {
  value?: string;
  children?: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}

export function Select({
  label,
  value,
  onChange,
  className,
  children,
  ...rest
}: {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  name?: string;
  children?: React.ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm text-gray-700">
      {label ? <span>{label}</span> : null}
      <select
        value={value || ""}
        className={cx(
          "w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          className
        )}
        onChange={(event) => onChange?.(event.target.value)}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}

export function Alert({
  open,
  icon,
  className,
  children,
}: {
  open?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className={cx("flex items-center gap-2 rounded-md border px-3 py-2", className)}>
      {icon}
      <div>{children}</div>
    </div>
  );
}
