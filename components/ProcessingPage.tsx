import React, { useState, useEffect } from 'react';
import { JobStatus, Results, processSteps, ImageFile, CustomizationOptions, ProcessStep, AvatarResult, SceneResult } from '../types';
import Spinner from './Spinner';
import { generateHeroImage, generateStoryCaptions } from '../services/geminiService';
import { getCharacterPrompt } from '../prompts';


interface ProcessingPageProps {
  jobId: string;
  files: ImageFile[];
  customization: CustomizationOptions;
  onProcessingComplete: (results: Results) => void;
}

const Stepper: React.FC<{ steps: readonly ProcessStep[]; currentStep: ProcessStep; status: JobStatus['status'] }> = ({ steps, currentStep, status }) => {
    const currentStepIndex = steps.indexOf(currentStep);
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex justify-between items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step} className={`flex-1 ${stepIdx < steps.length -1 ? "pr-8 sm:pr-20" : ""} relative`}>
                        {stepIdx <= currentStepIndex ? (
                            <>
                                <div className="absolute inset-0 top-1/2 -mt-1 w-full h-2 bg-brand-primary" aria-hidden="true" />
                                <div
                                    className="relative w-8 h-8 md:w-10 md:h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold"
                                >
                                ✓
                                </div>
                            </>
                        ) : (
                             <>
                                <div className="absolute inset-0 top-1/2 -mt-1 w-full h-2 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                                <div
                                    className="relative w-8 h-8 md:w-10 md:h-10 bg-slate-200 dark:bg-slate-700 rounded-full"
                                />
                            </>
                        )}
                        <span className={`block mt-2 text-xs md:text-sm font-bold ${stepIdx <= currentStepIndex ? 'text-brand-primary dark:text-brand-light' : 'text-slate-500'}`}>{step}</span>
                    </li>
                ))}
            </ol>
        </nav>
    );
};


const ProcessingPage: React.FC<ProcessingPageProps> = ({ jobId, files, customization, onProcessingComplete }) => {
  const [status, setStatus] = useState<JobStatus | null>(null);

  useEffect(() => {
    const process = async () => {
      // 1. Initial status
      setStatus({
        jobId,
        status: 'IN_PROGRESS',
        progress: 0,
        currentStep: processSteps[0], // Uploading Files
        log: 'Job created. Starting...',
      });

      try {
        // Correctly count all progress update steps: 1 upload + 1 preprocess + 1 story + 10 avatars + 1 transition + 3 scenes
        const totalTasks = 17;
        let tasksCompleted = 0;

        const updateProgress = (step: ProcessStep, log: string) => {
            tasksCompleted++;
            setStatus(prev => ({
                ...prev!,
                progress: Math.min(100, Math.round((tasksCompleted / totalTasks) * 100)),
                currentStep: step,
                log,
            }));
        };

        // 2. Preprocessing
        updateProgress('Uploading Files', 'Preparing your main photo...');
        const primaryImage = files[0];
        if (!primaryImage) throw new Error("No images found to process.");
        
        const dataUrl = primaryImage.dataUrl;
        if (!dataUrl) {
            throw new Error("Primary image is missing its data URL. Please re-upload.");
        }
        
        const [header, base64Image] = dataUrl.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';

        if (!base64Image) {
            throw new Error("Could not parse base64 data from dataUrl.");
        }

        // 3. Generate Captions
        updateProgress('Preprocessing Images', "Writing your hero's story...");
        const captions = await generateStoryCaptions(customization);

        // 4. Generate Avatars
        updateProgress('Generating Story', 'Creating cartoon avatars...');
        const avatarResults: AvatarResult[] = [];
        const avatarPrompt = getCharacterPrompt({ ...customization, pose: 'Action Ready' }) + ' Focus on a head and shoulders portrait view, perfect for a profile picture. Neutral background.';
        for (let i = 0; i < 10; i++) {
          const avatarUrl = await generateHeroImage(base64Image, mimeType, avatarPrompt);
          avatarResults.push({ id: `avatar_${i}`, url: avatarUrl });
          updateProgress('Stylizing Avatars', `Generated avatar ${i + 1} of 10...`);
        }
        
        // 5. Generate Scenes
        updateProgress('Stylizing Avatars', 'Illustrating story scenes...');
        const sceneResults: SceneResult[] = [];
        for (let i = 0; i < 3; i++) {
          const scenePrompt = getCharacterPrompt(customization);
          const sceneUrl = await generateHeroImage(base64Image, mimeType, scenePrompt);
          sceneResults.push({ id: `scene_${i}`, url: sceneUrl, caption: captions[i] || `Scene ${i+1}: An epic adventure unfolds!` });
          updateProgress('Generating Scenes', `Generated scene ${i + 1} of 3...`);
        }

        // 6. Finalize
        setStatus(prev => ({ ...prev!, status: 'SUCCESS', progress: 100, log: 'Your hero is ready!' }));
        
        const finalResults: Results = {
            jobId,
            avatars: avatarResults,
            scenes: sceneResults,
            zipUrl: '#',
        };

        setTimeout(() => {
            onProcessingComplete(finalResults);
        }, 1500);

      } catch (error) {
        console.error('Processing failed:', error);
        setStatus(prev => ({
            ...prev!,
            status: 'FAILURE',
            log: `An error occurred. Please try again.`
        }));
      }
    };

    if (jobId && files.length > 0 && customization) {
      process();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);
  
  // The logic for processing steps was slightly off, adjusted it in the process function.
  // 'Uploading Files' is step 1, but we immediately move to preprocessing.
  // So I'll change the initial step to 'Uploading Files' and the first update to it.

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-cartoon">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Creating Your Hero...</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Our AI is working its magic. This may take a few minutes.</p>

            {status ? (
                <>
                    <div className="mb-10 px-4">
                       <Stepper steps={processSteps} currentStep={status.currentStep} status={status.status} />
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-6 mb-4 border-2 border-black p-1">
                        <div
                            className="bg-gradient-to-r from-green-400 to-brand-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${status.progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                           {status.status === 'IN_PROGRESS' && <Spinner className="w-5 h-5" />}
                           <span className="font-bold">{status.log}</span>
                        </div>
                        <span className="font-bold text-lg">{status.progress}%</span>
                    </div>

                    {status.status === 'FAILURE' && (
                        <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-black rounded-xl text-red-700 dark:text-red-200">
                            <p className="font-bold text-lg">Processing Failed</p>
                            <p>{status.log}</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center">
                    <Spinner className="w-12 h-12 text-brand-primary" />
                    <p className="mt-4 font-bold">Initializing job...</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProcessingPage;