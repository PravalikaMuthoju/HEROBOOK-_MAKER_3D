import React, { useState, useCallback, useRef } from 'react';
import { ImageFile } from '../types';
import { MAX_FILES, ACCEPTED_FILE_TYPES, MIN_FILES, MIN_RESOLUTION } from '../constants';
import { useImageValidator } from '../hooks/useImageValidator';
import Icon from './Icon';
import Spinner from './Spinner';

interface UploadPageProps {
  onUploadComplete: (files: ImageFile[]) => void;
  existingFiles: ImageFile[];
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadComplete, existingFiles }) => {
  const [files, setFiles] = useState<ImageFile[]>(existingFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { validateImage } = useImageValidator();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return;
    setIsProcessing(true);

    const newImageFiles: ImageFile[] = [...files];
    const filesToProcess = Array.from(fileList).slice(0, MAX_FILES - newImageFiles.length);

    for (const file of filesToProcess) {
      const id = `${file.name}-${file.lastModified}`;
      if (newImageFiles.some(f => f.id === id)) continue;

      const error = await validateImage(file);
      
      let dataUrl = '';
      try {
          const result = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = error => reject(error);
          });
          dataUrl = result;
      } catch (e) {
           console.error("Failed to convert file to data URL", e);
      }

      newImageFiles.push({
        id,
        file,
        previewUrl: dataUrl,
        dataUrl: dataUrl,
        error,
      });
    }

    setFiles(newImageFiles);
    setIsProcessing(false);
  }, [files, validateImage]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = ''; // Reset input to allow re-uploading the same file
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };
  
  const validFiles = files.filter(f => !f.error);

  return (
    <div className="animate-slide-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Upload Your Hero's Photos</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Add between {MIN_FILES} and {MAX_FILES} photos. For best results, use high-quality images where the face is clearly visible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Upload Area */}
        <div 
          className={`relative flex flex-col items-center justify-center p-8 border-4 border-dashed rounded-3xl transition-colors duration-300 ${isDragging ? 'border-brand-secondary bg-amber-100 dark:bg-amber-900/40' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isProcessing && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center z-10 rounded-3xl">
                <Spinner className="w-12 h-12 text-brand-primary"/>
            </div>
          )}
          <Icon name="upload" className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
          <p className="text-xl font-bold text-slate-600 dark:text-slate-300">Drag & Drop Photos Here</p>
          <p className="text-slate-500 dark:text-slate-400 my-2">or</p>
          <div className="flex flex-col sm:flex-row gap-4">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={ACCEPTED_FILE_TYPES} multiple hidden />
              <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-white dark:bg-slate-700 border-2 border-black rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-cartoon-sm hover:shadow-cartoon hover:-translate-y-0.5 transform">
                  Browse Files
              </button>
              <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="user" hidden />
              <button onClick={() => cameraInputRef.current?.click()} className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 border-2 border-black rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-cartoon-sm hover:shadow-cartoon hover:-translate-y-0.5 transform">
                  <Icon name="camera" className="w-5 h-5" />
                  Use Camera
              </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">Max {MAX_FILES} images, {MIN_RESOLUTION}x{MIN_RESOLUTION}px minimum.</p>
        </div>

        {/* Right Side: Instructions */}
        <div className="bg-amber-50 dark:bg-slate-800/50 p-6 rounded-3xl border-2 border-black shadow-cartoon-sm">
          <h3 className="text-2xl font-bold mb-4">Photo Guidelines</h3>
          <ul className="space-y-4 text-slate-700 dark:text-slate-200">
            <li className="flex items-start gap-3"><Icon name="check" className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" /><div><span className="font-bold">One Face:</span> Use photos with only one person.</div></li>
            <li className="flex items-start gap-3"><Icon name="check" className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" /><div><span className="font-bold">Good Lighting:</span> Face should be clear, not in shadow.</div></li>
            <li className="flex items-start gap-3"><Icon name="warning" className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0" /><div><span className="font-bold">No Obstructions:</span> Avoid sunglasses, hats, or face coverings.</div></li>
            <li className="flex items-start gap-3"><Icon name="warning" className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0" /><div><span className="font-bold">Variety is Key:</span> Different angles and expressions are great!</div></li>
          </ul>
        </div>
      </div>
      
      {/* Previews */}
      {files.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Your Photos ({validFiles.length}/{files.length} valid)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {files.map(f => (
              <div key={f.id} className="relative group aspect-square">
                 <div className="absolute inset-0 bg-white p-2 rounded-2xl border-2 border-black shadow-cartoon-sm transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                     <img src={f.previewUrl} alt={f.id} className={`w-full h-full object-cover rounded-lg ${f.error ? 'opacity-40' : ''}`} />
                     {f.error && (
                       <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center text-white p-2 text-center rounded-lg">
                         <Icon name="warning" className="w-8 h-8 mb-1" />
                         <p className="text-xs font-semibold">{f.error}</p>
                       </div>
                     )}
                 </div>
                <button onClick={() => removeFile(f.id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 z-10 transform group-hover:scale-110">
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            ))}
            {files.length < MAX_FILES && (
                 <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="flex flex-col items-center justify-center aspect-square border-4 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-brand-secondary transition-colors">
                     <Icon name="plus" className="w-10 h-10"/>
                     <span className="font-bold mt-2">Add More</span>
                 </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <button 
          onClick={() => onUploadComplete(validFiles)} 
          disabled={validFiles.length < MIN_FILES}
          className="px-10 py-4 text-xl font-bold text-white bg-brand-primary rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 disabled:bg-slate-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
        >
          {validFiles.length < MIN_FILES ? `Need ${MIN_FILES - validFiles.length} More Photos` : `Next: Review & Customize`}
        </button>
      </div>
    </div>
  );
};

export default UploadPage;