import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface VariableExtractSectionProps {
  variables: Record<string, string>;
  onVariablesChange: (variables: Record<string, string>) => void;
}

const VariableExtractSection: React.FC<VariableExtractSectionProps> = ({
  variables,
  onVariablesChange,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVariable, setNewVariable] = useState({ name: '', description: '' });

  // Handle escape key to close form
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showAddForm) {
        setShowAddForm(false);
        setNewVariable({ name: '', description: '' });
      }
    };

    if (showAddForm) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showAddForm]);

  const handleAddVariable = () => {
    if (newVariable.name.trim() && newVariable.description.trim()) {
      const variableName = newVariable.name.trim();
      const variableDescription = newVariable.description.trim();
      
      onVariablesChange({
        ...variables,
        [variableName]: variableDescription
      });
      
      setNewVariable({ name: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleRemoveVariable = (variableName: string) => {
    const newVariables = { ...variables };
    delete newVariables[variableName];
    onVariablesChange(newVariables);
  };

  const handleUpdateVariable = (oldName: string, newName: string, description: string) => {
    const newVariables = { ...variables };
    delete newVariables[oldName];
    newVariables[newName] = description;
    onVariablesChange(newVariables);
  };

  const variableEntries = Object.entries(variables);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Variables to Extract</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Variable
        </Button>
      </div>

      {/* Add Variable Form */}
      {showAddForm && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3 relative">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Add New Variable</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setNewVariable({ name: '', description: '' });
              }}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variable Name
            </label>
            <input
              type="text"
              value={newVariable.name}
              onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
              placeholder="e.g., customer_name, order_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newVariable.description}
              onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
              placeholder="Describe what this variable should extract..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddVariable}
              disabled={!newVariable.name.trim() || !newVariable.description.trim()}
              size="sm"
            >
              Add Variable
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddForm(false);
                setNewVariable({ name: '', description: '' });
              }}
              size="sm"
            >
              Cancel
            </Button>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> to cancel
          </div>
        </div>
      )}

      {/* Variables List */}
      {variableEntries.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Extracted Variables ({variableEntries.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {variableEntries.map(([variableName, description]) => (
              <VariableItem
                key={variableName}
                variableName={variableName}
                description={description}
                onUpdate={(newName, newDescription) => handleUpdateVariable(variableName, newName, newDescription)}
                onDelete={() => handleRemoveVariable(variableName)}
              />
            ))}
          </div>
        </div>
      )}

      {variableEntries.length === 0 && !showAddForm && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No variables defined. Click "Add Variable" to start extracting data.
        </div>
      )}
    </div>
  );
};

// Separate component for individual variable items
interface VariableItemProps {
  variableName: string;
  description: string;
  onUpdate: (newName: string, newDescription: string) => void;
  onDelete: () => void;
}

const VariableItem: React.FC<VariableItemProps> = ({
  variableName,
  description,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(variableName);
  const [editDescription, setEditDescription] = useState(description);

  const handleSave = () => {
    if (editName.trim() && editDescription.trim()) {
      onUpdate(editName.trim(), editDescription.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(variableName);
    setEditDescription(description);
    setIsEditing(false);
  };

  return (
    <div className="p-3 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Variable Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <div className="px-2 py-1 bg-gray-50 rounded text-sm font-mono">
                {variableName}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            ) : (
              <div className="px-2 py-1 bg-gray-50 rounded text-sm">
                {description}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariableExtractSection; 