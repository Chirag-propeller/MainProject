import { useDarkMode } from "@/contexts/DarkModeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-500 dark:text-white"
    >
      {darkMode ? (
        <MdLightMode color="black" size={20} />
      ) : (
        <MdDarkMode color="black" size={20} />
      )}
    </button>
  );
};

export default DarkModeToggle;
