// components/TranscriptBox.tsx
// import { Transcript } from "@/types";

export type TranscriptItem = {
  id: string;
  type: "message";
  role: "assistant" | "user";
  content: string[];
  interrupted?: boolean;
};

export type Transcript = {
  items: TranscriptItem[];
};

type Props = {
  transcript: Transcript;
};

export default function TranscriptBox({ transcript }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-y-scroll h-100 border-2 border-gray-200 dark:border-gray-700 shadow-md rounded-sm p-2 w-full space-y-2 custom-scrollbar">
      <div>
        {transcript.items.map((item: any) => {
          if (!item.content?.length || item.content.join("").trim() === "")
            return null;

          const isUser = item.role === "user";
          return (
            <div
              key={item.id}
              className={`flex mb-1 ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
      relative max-w-[70%] px-3 py-2 rounded-[6px] shadow-sm my-1
      ${isUser ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-200 bubble-user" : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 bubble-agent"}
    `}
              >
                <span className="block text-xs font-semibold mb-1">
                  {isUser ? "User" : "Agent"}
                </span>
                <span className="block text-xs">{item.content.join(" ")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
