import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const CrawlModal = ({
  onClose,
  onSubmit,
  url,
  setUrl,
}: {
  onClose: () => void;
  onSubmit: () => void;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-gray-900/80 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white border border-gray-500 dark:bg-gray-900 p-6 rounded shadow w-[40vw]"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Add Web Pages
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <label className="text-sm font-medium block mb-1 text-gray-900 dark:text-gray-200">
            Website URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border p-2 rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button>Crawl</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrawlModal;
