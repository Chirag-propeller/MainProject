// components/TranscriptBox.tsx
// import { Transcript } from "@/types";

export type TranscriptItem = {
    id: string;
    type: 'message';
    role: 'assistant' | 'user';
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
    <div className="bg-white overflow-y-scroll h-100 border-2 border-gray-200 shadow-md rounded-sm p-2 w-full space-y-2 ">
        <div className="">
      {transcript.items.map((item: any) => {
        if (!item.content?.length) return null;
        // if (item.content?.trim() === "") return null;
        // if (item.content.trim() === "") return null;
        if (item.content?.join("").trim() === "") return null;

        const isUser = item.role === "user";
        // if (item.content.trim() === "") return null;
        return (
          <div
            key={item.id}
            className={`flex gap-0 justify-start mb-1
            }`}
          >
            <div
              className={` px-1 text-xs
              `}
            >
            
              {isUser ? <span className=" font-semibold">User: </span> : <span className="text-indigo-700 font-semibold">Agent: </span>}
              {isUser ?<span className="text-gray-500">{item.content.join(" ")}</span> : <span className="text-indigo-500">{item.content.join(" ")}</span>}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
