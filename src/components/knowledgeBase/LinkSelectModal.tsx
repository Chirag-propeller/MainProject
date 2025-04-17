
'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

const LinkSelectModal = ({
  links,
  selectedLinks,
  setSelectedLinks,
  onSave,
  onClose,
}: {
  links: string[]
  selectedLinks: string[]
  setSelectedLinks: React.Dispatch<React.SetStateAction<string[]>>
  onSave: () => void
  onClose: () => void
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // 🔁 Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleCheckboxChange = (link: string) => {
    setSelectedLinks((prev) =>
      prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded shadow max-h-[90vh] overflow-y-auto w-[50vw]"
      >
        <h2 className="text-xl font-semibold mb-4">Select Pages to Add</h2>
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`link-${index}`}
                checked={selectedLinks.includes(link)}
                onChange={() => handleCheckboxChange(link)}
                className="mr-2"
              />
              <label htmlFor={`link-${index}`} className="cursor-pointer">
                {link}
              </label>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}

export default LinkSelectModal
