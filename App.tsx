
import React, { useState, useEffect } from 'react';
import { Page, ImageFile, Results, CustomizationOptions } from './types';
import { STYLE_OPTIONS, COLOR_OPTIONS, POSE_OPTIONS, HAIR_COLOR_OPTIONS, EMBLEM_OPTIONS } from './constants';
import UploadPage from './components/UploadPage';
import ReviewPage from './components/ReviewPage';
import ProcessingPage from './components/ProcessingPage';
import ResultsPage from './components/ResultsPage';
import DashboardPage from './components/DashboardPage';
import CustomizePage from './components/CustomizePage';
import SettingsPage from './components/SettingsPage';
import HeroProfileCardPage from './components/HeroProfileCardPage';
import CreditsPage from './components/CreditsPage';
import Particles from './components/Particles';
import Footer from './components/Footer';
import MobileNavBar from './components/MobileNavBar';
import { useSettings } from './hooks/useSettings';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import ComicStripCreatorPage from './components/ComicStripCreatorPage';

const App: React.FC = () => {
  const { settings } = useSettings();
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [pageHistory, setPageHistory] = useState<Page[]>([]);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    style: STYLE_OPTIONS[0],
    color: COLOR_OPTIONS[0],
    pose: POSE_OPTIONS[0],
    heroName: '',
    hairColor: HAIR_COLOR_OPTIONS[0],
    emblemShape: EMBLEM_OPTIONS[0],
  });

  // Hydrate state from localStorage on initial load
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('heroBookSession');
      if (savedState) {
        const { page, images, jobId, results, customization } = JSON.parse(savedState);
        
        const hasImages = images && Array.isArray(images) && images.length > 0;
        const hasResults = !!results;
        
        // Hydrate whatever data is available
        if (hasImages) setImageFiles(images);
        if (hasResults) setResults(results);
        if (jobId) setJobId(jobId);
        if (customization) setCustomization(customization);
        
        // Now, validate the page based on hydrated data
        const pagesRequiringImages: Page[] = [Page.Review, Page.Customize, Page.Processing, Page.ComicCreator];
        const pagesRequiringResults: Page[] = [Page.Results, Page.ProfileCard, Page.ComicCreator];

        let destinationPage = page || Page.Dashboard;

        if (pagesRequiringImages.includes(destinationPage) && !hasImages) {
          console.warn("Saved page requires images, but none found in session. Redirecting to Upload.");
          destinationPage = Page.Upload;
        }
        if (pagesRequiringResults.includes(destinationPage) && !hasResults) {
          console.warn("Saved page requires results, but none found in session. Redirecting to Dashboard.");
          destinationPage = Page.Dashboard;
        }
        
        // Any returning user should see the dashboard, not the landing page.
        if (destinationPage === Page.Landing) {
            destinationPage = Page.Dashboard;
        }

        setCurrentPage(destinationPage);
      }
      // If no saved state, default is Page.Landing for a new user.
    } catch (error) {
      console.error("Could not load session from localStorage", error);
      localStorage.removeItem('heroBookSession');
      setCurrentPage(Page.Landing);
    }
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      // Don't save landing page as the last page
      const pageToSave = currentPage === Page.Landing ? Page.Dashboard : currentPage;
      const sessionState = {
        page: pageToSave,
        images: imageFiles,
        jobId,
        results,
        customization,
      };
      localStorage.setItem('heroBookSession', JSON.stringify(sessionState));
    } catch (error) {
        if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
          console.warn('LocalStorage quota exceeded. Saving session state without large image data.');
          // As a fallback, save a "slim" version of the state without the large image data.
          // The user will lose their uploaded/generated images on refresh, but not other settings.
          try {
            const pageToSave = currentPage === Page.Landing ? Page.Dashboard : currentPage;
            const slimSessionState = {
                page: pageToSave,
                jobId,
                customization,
                // images and results are omitted to prevent errors
            };
            localStorage.setItem('heroBookSession', JSON.stringify(slimSessionState));
          } catch(slimError) {
            console.error("Could not save even the slim session state.", slimError);
          }
      } else {
        console.error("Could not save session to localStorage", error);
      }
    }
  }, [currentPage, imageFiles, jobId, results, customization]);

  const navigate = (page: Page) => {
    if (page !== currentPage) {
      setPageHistory(prev => [...prev, currentPage]);
    }
    setCurrentPage(page);
  };
  
  const handleBack = () => {
    setPageHistory(prev => {
        const newHistory = [...prev];
        const lastPage = newHistory.pop();
        if(lastPage) {
            setCurrentPage(lastPage);
        }
        return newHistory;
    });
};

  const handleStart = () => navigate(Page.Upload);

  const handleFilesUploaded = (files: ImageFile[]) => {
    setImageFiles(files);
    navigate(Page.Review);
  };
  
  const handleReviewComplete = (finalFiles: ImageFile[]) => {
     setImageFiles(finalFiles);
     navigate(Page.Customize);
  }

  const handleCustomizationComplete = (options: CustomizationOptions) => {
    setCustomization(options);
    const mockJobId = `job_${Date.now()}`;
    setJobId(mockJobId);
    navigate(Page.Processing);
  };

  const handleProcessingComplete = (res: Results) => {
    setResults(res);
    navigate(Page.Results);
  };

  const handleRestart = (startNew: boolean = false) => {
    // Clear session data
    localStorage.removeItem('heroBookSession');
    sessionStorage.removeItem('hasSeenConfetti');
    // Reset state
    setImageFiles([]);
    setJobId(null);
    setResults(null);
    setPageHistory([]);
    setCustomization({
        style: STYLE_OPTIONS[0],
        color: COLOR_OPTIONS[0],
        pose: POSE_OPTIONS[0],
        heroName: '',
        hairColor: HAIR_COLOR_OPTIONS[0],
        emblemShape: EMBLEM_OPTIONS[0],
    });
    setCurrentPage(startNew ? Page.Upload : Page.Landing);
  };

  const handleContinue = () => {
    try {
      const savedState = localStorage.getItem('heroBookSession');
      if (savedState) {
        const { page } = JSON.parse(savedState);
        // Navigate to last page, or to upload if last page was dashboard/landing
        if (page && page !== Page.Dashboard && page !== Page.Landing) {
          setCurrentPage(page);
        } else {
          navigate(Page.Upload);
        }
      } else {
        // Fallback if continue is clicked without a session
        navigate(Page.Upload);
      }
    } catch (error) {
      console.error("Could not continue session", error);
      // Fallback to upload on error
      navigate(Page.Upload);
    }
  };


  const renderPage = () => {
    switch (currentPage) {
      case Page.Landing:
        return <LandingPage onStart={handleStart} />;
      case Page.Dashboard:
        return <DashboardPage onStart={() => handleRestart(true)} onContinue={handleContinue} imageCount={imageFiles.length} avatarCount={results?.avatars.length || 0} sceneCount={results?.scenes.length || 0} />;
      case Page.Upload:
        return <UploadPage onUploadComplete={handleFilesUploaded} existingFiles={imageFiles}/>;
      case Page.Review:
        return <ReviewPage files={imageFiles} onReviewComplete={handleReviewComplete} onAddMore={() => navigate(Page.Upload)} />;
      case Page.Customize:
        return <CustomizePage initialOptions={customization} onComplete={handleCustomizationComplete} />;
      case Page.Processing:
        return <ProcessingPage jobId={jobId!} files={imageFiles} customization={customization!} onProcessingComplete={handleProcessingComplete} />;
      case Page.Results:
        return <ResultsPage results={results!} customization={customization!} onRestart={() => handleRestart(false)} onNavigate={navigate} />;
      case Page.ProfileCard:
        return <HeroProfileCardPage results={results} customization={customization} />;
       case Page.Settings:
        return <SettingsPage onNavigate={navigate} />;
      case Page.Credits:
        return <CreditsPage />;
      case Page.ComicCreator:
        return <ComicStripCreatorPage avatars={results?.avatars || []} />;
      default:
        // A returning user with a session will default to Dashboard, a new user to Landing
        return imageFiles.length > 0 || results ? <DashboardPage onStart={() => handleRestart(true)} onContinue={handleContinue} imageCount={imageFiles.length} avatarCount={results?.avatars.length || 0} sceneCount={results?.scenes.length || 0} /> : <LandingPage onStart={handleStart} />;
    }
  };
  
  const backgroundClass = settings.theme === 'black'
    ? 'bg-black' 
    : 'bg-gradient-to-br from-indigo-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900';


  return (
    <div className={`min-h-screen ${backgroundClass} text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 ${settings.enableAnimations ? '' : 'no-animations'}`}>
        {settings.enableAnimations && <Particles />}
        <Header currentPage={currentPage} onBack={handleBack} pageHistory={pageHistory}/>
        <main className="container mx-auto px-4 py-8 md:py-12 pt-24 md:pt-12 pb-24 md:pb-12">
            {renderPage()}
        </main>
        <Footer />
        <MobileNavBar activePage={currentPage} onNavigate={navigate} />
    </div>
  );
};

export default App;