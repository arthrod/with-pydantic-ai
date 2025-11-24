import clsx from "clsx";

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  inProgress?: boolean;
}

/**
 * Renders a compact action button that can be disabled or show an in-progress state.
 *
 * @param children - Content placed inside the button.
 * @param onClick - Click handler invoked when the button is activated.
 * @param disabled - When true, the button is disabled and shows reduced opacity and a not-allowed cursor.
 * @param inProgress - When true, the button is disabled, displays an in-progress visual state (bounce and color), and prevents interaction.
 * @returns The rendered button element configured according to the provided props.
 */
export function ActionButton({ children, onClick, disabled, inProgress }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || inProgress}
      className={clsx(
        "text-white font-bold w-7 h-7 flex items-center justify-center rounded-md",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:border hover:border-white",
        inProgress && "animate-bounce text-blue-400 cursor-not-allowed hover:border-none",
      )}
    >
      {children}
    </button>
  );
}