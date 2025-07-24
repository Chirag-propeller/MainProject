"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X, Edit, Save, Trash2, Variable } from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'

interface VariablesModalProps {
  isOpen: boolean
  onClose: () => void
}

const VariablesModal: React.FC<VariablesModalProps> = ({ isOpen, onClose }) => {
  const { globalVariables, setGlobalVariables, nodes } = useWorkflowStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVariable, setNewVariable] = useState({ name: '', defaultValue: '' })
  const [editingVariable, setEditingVariable] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', defaultValue: '' })

  // Get all extracting variables from nodes
  const extractingVariables: Record<string, string> = {}
  nodes.forEach(node => {
    if (node.data && node.data.variables) {
      Object.entries(node.data.variables).forEach(([key, value]) => {
        extractingVariables[key] = value
      })
    }
  })

  const handleAddGlobalVariable = () => {
    if (newVariable.name.trim() && newVariable.defaultValue.trim()) {
      const variableName = newVariable.name.trim()
      const defaultValue = newVariable.defaultValue.trim()
      
      setGlobalVariables({
        ...globalVariables,
        [variableName]: defaultValue
      })
      
      setNewVariable({ name: '', defaultValue: '' })
      setShowAddForm(false)
    }
  }

  const handleUpdateGlobalVariable = (oldName: string) => {
    if (editForm.name.trim() && editForm.defaultValue.trim()) {
      const newVariables = { ...globalVariables }
      delete newVariables[oldName]
      newVariables[editForm.name.trim()] = editForm.defaultValue.trim()
      setGlobalVariables(newVariables)
      setEditingVariable(null)
      setEditForm({ name: '', defaultValue: '' })
    }
  }

  const handleDeleteGlobalVariable = (variableName: string) => {
    const newVariables = { ...globalVariables }
    delete newVariables[variableName]
    setGlobalVariables(newVariables)
  }

  const startEditing = (name: string, defaultValue: string) => {
    setEditingVariable(name)
    setEditForm({ name, defaultValue })
  }

  const cancelEditing = () => {
    setEditingVariable(null)
    setEditForm({ name: '', defaultValue: '' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[75vh] overflow-hidden">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Variable className="w-3 h-3 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Variables</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100 h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(75vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Global Variables Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Global Variables</h3>
                  <p className="text-xs text-gray-500">Add variables available throughout the workflow</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1 hover:bg-indigo-50 h-7 px-2 text-xs"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>

              {/* Compact Add Form */}
              {showAddForm && (
                <div className="p-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="var-name" className="text-xs font-medium text-gray-700">Name</Label>
                        <Input
                          id="var-name"
                          type="text"
                          value={newVariable.name}
                          onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                          placeholder="variable_name"
                          className="mt-1 h-6 text-xs"
                        />
                      </div>
                      <div>
                        <Label htmlFor="var-value" className="text-xs font-medium text-gray-700">Default Value</Label>
                        <Input
                          id="var-value"
                          type="text"
                          value={newVariable.defaultValue}
                          onChange={(e) => setNewVariable({ ...newVariable, defaultValue: e.target.value })}
                          placeholder="default value"
                          className="mt-1 h-6 text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={handleAddGlobalVariable}
                        disabled={!newVariable.name.trim() || !newVariable.defaultValue.trim()}
                        size="sm"
                        className="h-6 px-2 text-xs bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowAddForm(false)
                          setNewVariable({ name: '', defaultValue: '' })
                        }}
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Global Variables List */}
              {Object.keys(globalVariables).length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {Object.entries(globalVariables).map(([name, defaultValue]) => (
                    <div key={name} className="group p-2 border border-gray-200 rounded-lg bg-white hover:border-indigo-300 hover:shadow-sm transition-all">
                      {editingVariable === name ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`edit-name-${name}`} className="text-xs font-medium text-gray-700">Name</Label>
                              <Input
                                id={`edit-name-${name}`}
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="mt-1 h-6 text-xs"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`edit-value-${name}`} className="text-xs font-medium text-gray-700">Default Value</Label>
                              <Input
                                id={`edit-value-${name}`}
                                type="text"
                                value={editForm.defaultValue}
                                onChange={(e) => setEditForm({ ...editForm, defaultValue: e.target.value })}
                                className="mt-1 h-6 text-xs"
                              />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleUpdateGlobalVariable(name)}
                              disabled={!editForm.name.trim() || !editForm.defaultValue.trim()}
                              size="sm"
                              className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button variant="ghost" onClick={cancelEditing} size="sm" className="h-6 px-2 text-xs">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs text-gray-900 truncate">{name}</div>
                            <div className="text-xs text-gray-500">Default: <span className="font-mono bg-gray-100 px-1 rounded text-xs">{defaultValue}</span></div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(name, defaultValue)}
                              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGlobalVariable(name)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Variable className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs">No global variables yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click "Add" to create your first variable</p>
                </div>
              )}
            </div>

            {/* Extracting Variables Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Extracting Variables</h3>
                  <p className="text-xs text-gray-500">Variables extracted from workflow nodes</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">
                    {Object.keys(extractingVariables).length} variables
                  </span>
                </div>
              </div>

              {/* Extracting Variables List */}
              {Object.keys(extractingVariables).length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {Object.entries(extractingVariables).map(([name, description]) => (
                    <div key={name} className="p-2 border border-gray-200 rounded-lg bg-white">
                      <div className="space-y-1">
                        <div className="font-medium text-xs text-gray-900">{name}</div>
                        <div className="text-xs text-gray-500 line-clamp-2">{description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Variable className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs">No extracting variables</p>
                  <p className="text-xs text-gray-400 mt-1">Variables will appear here when defined in nodes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariablesModal 