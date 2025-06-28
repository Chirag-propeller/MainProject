type Props = {
    heading: string;
    subheading?: string;
    value: string | number;
    icon?: React.ReactNode;
  };
  

  const NumberCard = ({ heading, subheading, value, icon }: Props)=> {
    return (
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/50 rounded-2xl p-4 w-[25vw] flex flex-col gap-2 border dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm text-gray-500 dark:text-gray-400">{heading}</h2>
            {subheading && <p className="text-xs text-gray-400 dark:text-gray-500">{subheading}</p>}
          </div>
          {icon && <div className="text-indigo-500 dark:text-indigo-400">{icon}</div>}
        </div>
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
      </div>
    );
  }
  

export default NumberCard;