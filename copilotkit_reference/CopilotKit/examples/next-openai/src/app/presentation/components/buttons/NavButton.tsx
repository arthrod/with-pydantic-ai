import clsx from "clsx";

interface NavButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Renders a square navigation button with configurable content, click handler, and disabled styling.
 *
 * @param children - Content to render inside the button (typically an icon or label).
 * @param onClick - Optional click handler invoked when the button is activated.
 * @param disabled - When true, the button is non-interactive and shown with reduced opacity.
 * @returns The configured button element for use in navigation controls.
 */
export function NavButton({ children, onClick, disabled }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-7 h-7 border border-white rounded-md flex justify-center items-center",
        "focus:outline-none",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white hover:text-black",
      )}
    >
      {children}
    </button>
  );
}