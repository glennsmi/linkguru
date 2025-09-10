import { useState } from 'react';
import { Plus, X, Calendar, Type, Tag } from 'lucide-react';
import { Annotation } from '../../../shared/src/schemas/link';

interface AnnotationManagerProps {
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  onDeleteAnnotation: (annotationId: string) => void;
  tenantId: string;
  linkId?: string;
  isDark?: boolean;
}

export default function AnnotationManager({
  annotations,
  onAddAnnotation,
  onDeleteAnnotation,
  tenantId,
  linkId,
  isDark = false
}: AnnotationManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState({
    title: '',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM format
    type: 'event' as const,
    color: '#ef4444'
  });

  const handleAddAnnotation = () => {
    if (!newAnnotation.title.trim() || !newAnnotation.description.trim()) {
      return;
    }

    onAddAnnotation({
      tenantId,
      linkId,
      title: newAnnotation.title,
      description: newAnnotation.description,
      timestamp: new Date(newAnnotation.timestamp),
      type: newAnnotation.type,
      color: newAnnotation.color,
      createdBy: 'current-user' // This should come from auth context
    });

    setNewAnnotation({
      title: '',
      description: '',
      timestamp: new Date().toISOString().slice(0, 16),
      type: 'event',
      color: '#ef4444'
    });
    setIsAdding(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar size={16} />;
      case 'milestone':
        return <Tag size={16} />;
      case 'campaign':
        return <Type size={16} />;
      default:
        return <Tag size={16} />;
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Chart Annotations
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            isDark
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Plus size={16} className="mr-1" />
          Add Annotation
        </button>
      </div>

      {isAdding && (
        <div className={`mb-4 p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Title
              </label>
              <input
                type="text"
                value={newAnnotation.title}
                onChange={(e) => setNewAnnotation(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                  isDark ? 'bg-slate-600 border-slate-500 text-white' : 'border-gray-300 bg-white'
                }`}
                placeholder="Enter annotation title"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={newAnnotation.description}
                onChange={(e) => setNewAnnotation(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                  isDark ? 'bg-slate-600 border-slate-500 text-white' : 'border-gray-300 bg-white'
                }`}
                placeholder="Describe what happened"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={newAnnotation.timestamp}
                  onChange={(e) => setNewAnnotation(prev => ({ ...prev, timestamp: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    isDark ? 'bg-slate-600 border-slate-500 text-white' : 'border-gray-300 bg-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <select
                  value={newAnnotation.type}
                  onChange={(e) => setNewAnnotation(prev => ({ ...prev, type: e.target.value as any }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    isDark ? 'bg-slate-600 border-slate-500 text-white' : 'border-gray-300 bg-white'
                  }`}
                >
                  <option value="event">Event</option>
                  <option value="milestone">Milestone</option>
                  <option value="campaign">Campaign</option>
                  <option value="note">Note</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Color
                </label>
                <input
                  type="color"
                  value={newAnnotation.color}
                  onChange={(e) => setNewAnnotation(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 border rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAdding(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDark
                    ? 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddAnnotation}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Add Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {annotations.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            No annotations yet. Add your first annotation to mark important events.
          </p>
        ) : (
          annotations.map((annotation) => (
            <div
              key={annotation.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: annotation.color }}
                />
                <div className="flex items-center space-x-2">
                  {getTypeIcon(annotation.type)}
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {annotation.title}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {new Date(annotation.timestamp).toLocaleString()} • {annotation.type}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteAnnotation(annotation.id)}
                className={`p-1 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-slate-600 text-slate-400 hover:text-slate-300'
                    : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
                }`}
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
