type Props = {
    heading: string;
    subheading?: string;
    value: string | number;
    icon?: React.ReactNode;
  };
  

  const NumberCard = ({ heading, subheading, value, icon }: Props)=> {
    return (
      <div className="bg-white shadow rounded-2xl p-4 w-[25vw] flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm text-gray-500">{heading}</h2>
            {subheading && <p className="text-xs text-gray-400">{subheading}</p>}
          </div>
          {icon && <div className="text-indigo-500">{icon}</div>}
        </div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
      </div>
    );
  }
  

export default NumberCard;