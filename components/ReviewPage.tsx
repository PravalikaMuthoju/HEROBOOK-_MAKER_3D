import React, { useState } from 'react';
import { ImageFile } from '../types';
import Icon from './Icon';

interface ReviewPageProps {
  files: ImageFile[];
  onReviewComplete: (files: ImageFile[]) => void;
  onAddMore: () => void;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ files: initialFiles, onReviewComplete, onAddMore }) => {
  const [files, setFiles] = useState<ImageFile[]>(initialFiles);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const removeFile = (id: string) => {
    setFiles(currentFiles => currentFiles.filter(f => f.id !== id));
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (draggedItemId === null || draggedItemId === targetId) return;

    const draggedItemIndex = files.findIndex(f => f.id === draggedItemId);
    const targetItemIndex = files.findIndex(f => f.id === targetId);
    
    const newFiles = [...files];
    const [draggedItem] = newFiles.splice(draggedItemIndex, 1);
    newFiles.splice(targetItemIndex, 0, draggedItem);
    
    setFiles(newFiles);
    setDraggedItemId(null);
  };

  const handleSubmit = () => {
    onReviewComplete(files);
  };

  return (
    <div className="animate-slide-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Review Your Photos</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Set your primary photo which will guide the AI.
        </p>
      </div>

      <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-black shadow-cartoon-sm">
        <h3 className="text-2xl font-bold mb-2">Your Photos</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">Drag to reorder. The <span className="font-bold text-brand-primary">first image</span> has the most influence on your hero's look!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {files.map((f, index) => (
              <div 
                key={f.id} 
                className="relative group aspect-square cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, f.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, f.id)}
              >
                <div className="absolute inset-0 bg-white p-2 rounded-2xl border-2 border-black shadow-cartoon-sm transform group-hover:scale-105 transition-transform duration-300">
                    <img src={f.previewUrl} alt={f.id} className="w-full h-full object-cover rounded-lg" />
                    {index === 0 && (
                        <div className="absolute top-0 left-0 bg-brand-secondary text-black text-xs font-bold px-2 py-1 rounded-br-lg rounded-tl-lg">#1</div>
                    )}
                </div>
                <button onClick={() => removeFile(f.id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 z-10 transform group-hover:scale-110">
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={onAddMore} className="flex flex-col items-center justify-center aspect-square border-4 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-brand-secondary transition-colors">
                <Icon name="plus" className="w-10 h-10" />
                <span className="font-bold mt-2">Add More</span>
            </button>
        </div>
      </div>

       <div className="mt-12 flex flex-col items-center justify-center">
            <button 
                onClick={handleSubmit} 
                className="px-12 py-4 text-2xl font-bold text-black bg-brand-secondary rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
            >
                Next: Customize Hero
            </button>
       </div>
    </div>
  );
};

export default ReviewPage;