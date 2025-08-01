import React from "react";
import { Api } from "../types";
import RequestConfig from "./general/RequestConfig";

interface ApiGeneralTabProps {
  api: Api;
  setApi: (agent: Api) => void;
}

const ApiGeneralTab: React.FC<ApiGeneralTabProps> = ({ api, setApi }) => {
  return (
    <div className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-900 p-2 relative text-black dark:text-white">
      <RequestConfig api={api} setApi={setApi} />
    </div>
  );
};

export default ApiGeneralTab;
