// components/DropdownList.tsx
'use client'

import { useEffect, useState, useRef } from "react";

interface KnowledgeBase {
  _id: string;
  name: string;
  files: any[];
  links: any[];
  [key: string]: any;
}

interface DropdownListProps {
  isOpen: boolean;
  setKnowledgeBaseList: (ids:string[])=>void;
  setKnowledgeBases: (ids:KnowledgeBase[])=>void;
  knowledgeBases: KnowledgeBase[];
  onClose: () => void;
}

const DropdownList: React.FC<DropdownListProps> = ({ isOpen,setKnowledgeBaseList, onClose, setKnowledgeBases, knowledgeBases }) => {
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (id: string) => {
    // console.log(selectedIds);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    console.log(selectedIds);
  };

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/knowledgeBase/get", { method: "GET" });
        const data = await res.json();
        setKnowledgeBases(data.knowledgeBases);
      } catch (err) {
        console.error("Error fetching knowledge bases:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchKnowledgeBases();
    }
  }, [isOpen]);

  // Close if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const submitHandler = ()=>{
    setKnowledgeBaseList(selectedIds);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute mt-3 bg-white border border-gray-300 rounded-lg shadow-md p-3 w-72 max-h-80 overflow-y-auto z-50"
    >
      <h2 className="text-sm font-semibold mb-3">Select Knowledge Bases</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {knowledgeBases.map((kb) => (
            <li key={kb._id} className="flex items-center">
              <input
                type="checkbox"
                id={kb._id}
                checked={selectedIds.includes(kb._id)}
                onChange={() => handleCheckboxChange(kb._id)}
                className="mr-2"
              />
              <label htmlFor={kb._id}>{kb.name}</label>
            </li>
          ))}
        </ul>
      )}
      {/* {selectedIds.map((li) => (<p key={li}>{li}</p>))} */}

    

      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
        onClick={submitHandler}
      >
        Done
      </button>
    </div>
  );
};

export default DropdownList;




// // components/ModalList.tsx
// import { useEffect, useState } from "react";

// interface KnowledgeBase {
//     _id: string;
//     name: string;
//     files: any[];  // we won't use these for now
//     links: any[];
//     [key: string]: any;  // allow extra fields without error
//   }

// interface ModalListProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ModalList: React.FC<ModalListProps> = ({ isOpen, onClose }) => {
//   const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);


//   const handleCheckboxChange = (id: string) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   useEffect(() => {
//     const fetchKnowledgeBases = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/knowledgeBase/get", { method: "GET" });
//         const data = await res.json();
//         setKnowledgeBases(data.knowledgeBases);
//       } catch (err) {
//         console.error("Error fetching knowledge bases:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     if (isOpen) {
//       fetchKnowledgeBases();
//     }
//   }, [isOpen]);
  

// //   useEffect(() => {
// //     if (isOpen) {
// //       setLoading(true);
      
// //       fetch("/api/knowledgeBase/get", { method: "GET" })
// //         .then((res) => res.json())
// //         .then((data) => {
// //           setKnowledgeBases(data.knowledgeBases);
// //           setLoading(false);
// //         })
// //         .catch((err) => {
// //           console.error("Error fetching knowledge bases:", err);
// //           setLoading(false);
// //         });
// //     }
// //   }, [isOpen]);



//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-700/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Select Knowledge Bases</h2>

//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <ul className="space-y-2">
//             {knowledgeBases.map((kb) => (
//               <li key={kb._id} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id={kb._id}
//                   checked={selectedIds.includes(kb._id)}
//                   onChange={() => handleCheckboxChange(kb._id)}
//                   className="mr-2"
//                 />
//                 <label htmlFor={kb._id}>{kb.name}</label>
//               </li>
//             ))}
//           </ul>
//         )}

//         <button
//           className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
//           onClick={onClose}
//         >
//           Done
//         </button>

//         <div className="mt-4 text-sm text-gray-500">
//           Selected IDs: {selectedIds.join(", ") || "None"}
//         </div>
//       </div>
//     </div>
//   );
// };


// export default ModalList;