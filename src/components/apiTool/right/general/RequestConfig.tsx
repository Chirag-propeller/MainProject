import React, { useEffect, useState } from "react";
import { FaNetworkWired } from "react-icons/fa";
import { MdKeyboardArrowDown, MdDelete } from "react-icons/md";
import TooltipLabel from "@/components/ui/tooltip";
import SelectionDropdown from "@/components/agents/SelectionDropdown";
import { Api } from "../../types";
import { FaCodeCompare } from "react-icons/fa6";

interface HeaderItem {
  id: number;
  key: string;
  value: string;
}

interface ParamItem {
  id: number;
  name: string;
  type: string;
  required: boolean;
  description: string;
}

const HTTP_METHODS = [
  { name: "GET", value: "GET" },
  { name: "POST", value: "POST" },
  { name: "PUT", value: "PUT" },
  { name: "PATCH", value: "PATCH" },
  { name: "DELETE", value: "DELETE" },
];

/* ---------------------------------------------------------- */
const headersObjToArray = (
  obj: Record<string, string> | undefined
): HeaderItem[] =>
  obj
    ? Object.entries(obj).map(([key, value], idx) => ({
        id: idx,
        key,
        value,
      }))
    : [];

const headersArrayToObj = (arr: HeaderItem[]): Record<string, string> => {
  const out: Record<string, string> = {};
  arr.forEach(({ key, value }) => {
    if (key) out[key] = value;
  });
  return out;
};

const paramsApiToArray = (params: Api["params"] | undefined): ParamItem[] =>
  params
    ? params.map((p, idx) => ({
        id: idx,
        name: p.name,
        type: p.type,
        required: Boolean(p.required),
        description: p.description || "",
      }))
    : [];

const paramsArrayToApi = (arr: ParamItem[]): Api["params"] =>
  arr.map(({ id: _id, ...rest }) => ({
    ...rest,
    required: rest.required || false,
    description: rest.description || "",
  }));

const ApiRequestConfig = ({
  api,
  setApi,
}: {
  api: Api;
  setApi: (cfg: Api) => void;
}) => {
  /** Collapsible card */
  const [isOpen, setIsOpen] = useState(true);

  /** Local UI state */
  const [apiName, setApiName] = useState(api.apiName || "");
  const [description, setDescription] = useState(api.description || "");
  const [endpoint, setEndpoint] = useState(api.endpoint || "");
  const [method, setMethod] = useState<Api["method"]>(api.method || "GET");
  const [headers, setHeaders] = useState<HeaderItem[]>(
    headersObjToArray(api.headers)
  );
  const [urlParams, setUrlParams] = useState<HeaderItem[]>(
    headersObjToArray(api.urlParams)
  );
  const [params, setParams] = useState<ParamItem[]>(
    paramsApiToArray(api.params)
  );
  const [variableToExtract, setVariableToExtract] = useState(
    api.variableToExtract?.split("|") || []
  );
  const [promptToExtractVariable, setPromptToExtractVariable] = useState(
    api.promptToExtractVariable?.split("|") || []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setApi({
        ...api, // keep untouched fields (auth info, timestamps, etc.)
        apiName,
        description,
        endpoint,
        method,
        headers: headersArrayToObj(headers),
        urlParams: headersArrayToObj(urlParams),
        params: paramsArrayToApi(params),
      });
    }, 300);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiName, description, endpoint, method, headers, urlParams, params]);

  const addHeader = () =>
    setHeaders((prev) => [
      ...prev,
      { id: Date.now(), key: "", value: "" } as HeaderItem,
    ]);

  const updateHeader = (id: number, field: "key" | "value", val: string) =>
    setHeaders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );

  const deleteHeader = (id: number) =>
    setHeaders((prev) => prev.filter((h) => h.id !== id));

  // URL Parameters functions
  const addUrlParam = () =>
    setUrlParams((prev) => [
      ...prev,
      { id: Date.now(), key: "", value: "" } as HeaderItem,
    ]);

  const updateUrlParam = (id: number, field: "key" | "value", val: string) =>
    setUrlParams((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );

  const deleteUrlParam = (id: number) =>
    setUrlParams((prev) => prev.filter((h) => h.id !== id));

  const addParam = () =>
    setParams((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        type: "string",
        required: false,
        description: "",
      } as ParamItem,
    ]);

  const updateParam = (
    id: number,
    field: keyof ParamItem,
    val: string | boolean
  ) =>
    setParams((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );

  const deleteParam = (id: number) =>
    setParams((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="border border-gray-200 rounded-[6px] bg-white shadow-sm hover:border-gray-300 space-y-2">
      {/* ---------- Collapsible header ---------- */}
      <header
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer bg-white border-b-background px-2 py-1 m-1 rounded-[6px]"
      >
        <div className="flex justify-between items-center m-1.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-100 rounded-[6px] flex items-center justify-center">
              <span className="text-blue-500 text-xl">
                <FaCodeCompare />
              </span>
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-gray-900 ml-1.5">
                API Request Configuration
              </h2>
              <p className="text-sm font-light text-gray-500 pt-1 ml-1.5">
                Configure endpoint, method, headers and parameters
              </p>
            </div>
          </div>
          <MdKeyboardArrowDown
            className={`w-8 h-8 transform transition-transform duration-300 text-gray-500 ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ fill: "gray" }}
          />
        </div>
      </header>

      {/* ---------- Body ---------- */}
      {isOpen && (
        <>
          <hr className="border-t border-gray-200 my-2" />
          <div className="px-4 py-5 flex flex-col gap-6">
            {/* API Name ------------------------------------------------ */}
            <div className="space-y-3">
              <TooltipLabel
                label="API Name"
                fieldKey="apiName"
                htmlFor="apiName"
              />
              <input
                id="apiName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm"
                placeholder="e.g., getUserData, sendNotification"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
              />
            </div>

            {/* Description ------------------------------------------- */}
            <div className="space-y-3">
              <TooltipLabel
                label="Description"
                fieldKey="description"
                htmlFor="description"
              />
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 pt-2 border border-gray-300 rounded-[6px] text-sm placeholder:text-gray-400"
                placeholder="Describe what this API does and when it should be used..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Endpoint & Method ------------------------------------- */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <TooltipLabel
                  label="Endpoint URL"
                  fieldKey="endpoint"
                  htmlFor="endpoint"
                />
                <p className="text-xs font-medium text-gray-600 mt-0.5">
                  Example:
                  https://api.test.com/v1/user?userID=1234&CustomerMobile=&#123;&#123;CustomerMobile&#125;&#125;
                </p>
                <input
                  id="endpoint"
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-sm"
                  placeholder="https://api.example.com/v1/endpoint"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>
            </div>
            <div className="lg:w-48 space-y-3">
              <TooltipLabel label="HTTP Method" fieldKey="httpMethod" />
              <SelectionDropdown
                options={HTTP_METHODS}
                selectedOption={method}
                setOption={(val) => setMethod(val as Api["method"])}
              />
            </div>

            {/* URL Params --------------------------------------------- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <TooltipLabel
                  label="Variable URL Parameters"
                  fieldKey="urlParams"
                />
                <button
                  type="button"
                  onClick={addUrlParam}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-[6px] hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 flex gap-2 justify-center items-center"
                >
                  + Add URL Params
                </button>
              </div>

              {urlParams.length === 0 ? (
                <div className="p-3 border-2 border-dashed border-gray-200 rounded-[6px] bg-gray-50">
                  <p className="text-sm font-medium text-gray-500 text-center">
                    No URL params configured. Click "Add URL Params" to create
                    one.
                  </p>
                </div>
              ) : (
                <div className="">
                  {urlParams.map((h) => (
                    <div
                      key={h.id}
                      className="flex gap-3 items-center p-2 bg-white hover:border-gray-300 transition-all duration-200"
                    >
                      <input
                        type="text"
                        placeholder="URL Param Key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-xs"
                        value={h.key}
                        onChange={(e) =>
                          updateUrlParam(h.id, "key", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-xs"
                        value={h.value}
                        onChange={(e) =>
                          updateUrlParam(h.id, "value", e.target.value)
                        }
                      />
                      <button
                        onClick={() => deleteUrlParam(h.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Headers ------------------------------------------------ */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <TooltipLabel label="Headers" fieldKey="headers" />
                <button
                  type="button"
                  onClick={addHeader}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-[6px] hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 flex justify-center items-center"
                >
                  + Add Header
                </button>
              </div>

              {headers.length === 0 ? (
                <div className="p-3 border-2 border-dashed border-gray-200 rounded-[6px] bg-gray-50">
                  <p className="text-sm font-medium text-gray-500 text-center">
                    No headers configured. Click "Add Header" to create one.
                  </p>
                </div>
              ) : (
                <div className="">
                  {headers.map((h) => (
                    <div
                      key={h.id}
                      className="flex gap-3 items-center p-2 bg-white hover:border-gray-300 transition-all duration-200"
                    >
                      <input
                        type="text"
                        placeholder="Header Key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-xs"
                        value={h.key}
                        onChange={(e) =>
                          updateHeader(h.id, "key", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Header Value"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-xs"
                        value={h.value}
                        onChange={(e) =>
                          updateHeader(h.id, "value", e.target.value)
                        }
                      />
                      <button
                        onClick={() => deleteHeader(h.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Params ------------------------------------------------- */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <TooltipLabel label="Parameters" fieldKey="params" />
                <button
                  type="button"
                  onClick={addParam}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-[6px] hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 flex gap-2 justify-center items-center"
                >
                  + Add Parameter
                </button>
              </div>

              {params.length === 0 ? (
                <div className="p-3 border-2 border-dashed border-gray-200 rounded-[6px] bg-gray-50">
                  <p className="text-sm font-medium text-gray-500 text-center">
                    No parameters configured. Click "Add Parameter" to create
                    one.
                  </p>
                </div>
              ) : (
                <div className="">
                  {params.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center p-2 bg-white"
                    >
                      <input
                        type="text"
                        placeholder="Parameter Name"
                        className="flex-[2] min-w-0 px-3 py-2 border border-gray-300 rounded-[6px] text-xs placeholder:text-xs"
                        value={p.name}
                        onChange={(e) =>
                          updateParam(p.id, "name", e.target.value)
                        }
                      />
                      <div className="flex-[1] min-w-[100px]">
                        <SelectionDropdown
                          options={[
                            { name: "string", value: "string" },
                            { name: "number", value: "number" },
                            { name: "boolean", value: "boolean" },
                            { name: "object", value: "object" },
                            { name: "array", value: "array" },
                          ]}
                          selectedOption={p.type}
                          setOption={(val) =>
                            updateParam(p.id, "type", val as string)
                          }
                          className="w-full px-3 py-2 text-xs font-medium border border-gray-300"
                        />
                      </div>

                      <label className="flex-[1] min-w-[110px] flex items-center text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={p.required}
                          onChange={(e) =>
                            updateParam(p.id, "required", e.target.checked)
                          }
                          className="mr-2"
                        />
                        Required
                      </label>

                      {/* Optional description field */}
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        className="flex-[3] min-w-0 px-3 py-2 border border-gray-300 rounded-[6px] text-xs"
                        value={p.description}
                        onChange={(e) =>
                          updateParam(p.id, "description", e.target.value)
                        }
                      />

                      <button
                        onClick={() => deleteParam(p.id)}
                        className="ml-auto p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200 flex items-center justify-center"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApiRequestConfig;
