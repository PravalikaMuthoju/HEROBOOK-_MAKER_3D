
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Results, Page, CustomizationOptions } from '../types';
import Icon from './Icon';
import { requestDataDeletion } from '../services/api';
import Spinner from './Spinner';

interface ResultsPageProps {
  results: Results;
  customization: CustomizationOptions;
  onRestart: () => void;
  onNavigate: (page: Page) => void;
}

const Modal: React.FC<{ title: string, children: React.ReactNode, onClose: () => void }> = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-3xl border-4 border-black shadow-cartoon max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                    <Icon name="x-mark" className="w-8 h-8" />
                </button>
                <h3 className="text-3xl font-bold mb-4">{title}</h3>
                <div>{children}</div>
            </div>
        </div>
    );
};

const ResultsPage: React.FC<ResultsPageProps> = ({ results, customization, onRestart, onNavigate }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const shareableLink = `${window.location.origin}#share=${results.jobId}`;
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const allItems = [...results.scenes, ...results.avatars];

  const scrollToIndex = (index: number) => {
    carouselRef.current?.children[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
    setCarouselIndex(index);
  }
  
  const handleCarouselScroll = (direction: 'left' | 'right') => {
      if (!carouselRef.current) return;
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
      });
  };

  useEffect(() => {
    const handleScroll = () => {
        if (!carouselRef.current) return;
        const scrollLeft = carouselRef.current.scrollLeft;
        const itemWidth = carouselRef.current.scrollWidth / allItems.length;
        const newIndex = Math.round(scrollLeft / itemWidth);
        if(newIndex !== carouselIndex) {
            setCarouselIndex(newIndex);
        }
    };
    const carousel = carouselRef.current;
    carousel?.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel?.removeEventListener('scroll', handleScroll);
  }, [allItems.length, carouselIndex]);

  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    await requestDataDeletion(results.jobId);
    setTimeout(() => {
        setIsDeleting(false);
        setShowDeleteModal(false);
        onRestart();
    }, 1500);
  };
  
  const handleCopyLink = () => {
      navigator.clipboard.writeText(shareableLink);
      setToastMessage("Link copied!");
      setTimeout(() => setToastMessage(null), 2000);
  }
  
  const handleDownloadAll = async () => {
    setIsDownloading(true);
    
    // Create an offscreen container for the collage
    const collageContainer = document.createElement('div');
    collageContainer.style.position = 'absolute';
    collageContainer.style.left = '-9999px';
    collageContainer.style.width = '1200px';
    collageContainer.style.padding = '20px';
    collageContainer.style.background = '#111827';
    collageContainer.style.display = 'grid';
    collageContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
    collageContainer.style.gap = '15px';

    document.body.appendChild(collageContainer);
    
    const allImages = [...results.avatars, ...results.scenes];

    const imageLoadPromises = allImages.map(item => {
        return new Promise<void>(resolve => {
            const img = document.createElement('img');
            img.src = item.url;
            img.crossOrigin = 'anonymous';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.border = '2px solid white';
            img.onload = () => {
                collageContainer.appendChild(img);
                resolve();
            };
            img.onerror = () => resolve(); // Resolve even if an image fails
        });
    });

    await Promise.all(imageLoadPromises);

    try {
        const canvas = await html2canvas(collageContainer, { useCORS: true });
        const link = document.createElement('a');
        link.download = `${customization.heroName || 'herobook'}-collection.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error("Failed to create collage", error);
        setToastMessage("Failed to create collage.");
        setTimeout(() => setToastMessage(null), 2000);
    } finally {
        document.body.removeChild(collageContainer);
        setIsDownloading(false);
    }
  };

  const ActionButton: React.FC<{onClick?: () => void; href?: string; download?: string; children: React.ReactNode; className?: string; disabled?: boolean;}> = ({ children, className, ...props }) => {
      const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none disabled:bg-slate-400 disabled:text-slate-600 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed";
      const combinedClasses = `${baseClasses} ${className}`;
      if (props.href) {
          return <a className={combinedClasses} {...props}>{children}</a>
      }
      return <button className={combinedClasses} {...props}>{children}</button>
  }

  return (
    <div className="animate-fade-in">
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-primary dark:text-brand-light drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] dark:drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">Your Hero is Ready!</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Explore your personalized creations or download your hero's official profile card.
            </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
            <ActionButton onClick={() => onNavigate(Page.ProfileCard)} className="bg-brand-accent text-white">
                View Profile Card
            </ActionButton>
            <ActionButton onClick={() => onNavigate(Page.ComicCreator)} className="bg-purple-600 text-white">
                Create Comic Strip
            </ActionButton>
            <ActionButton onClick={() => setShowShareModal(true)} className="bg-blue-500 text-white">
                <Icon name="share" />
                Share
            </ActionButton>
        </div>

        {/* Gallery Carousel Viewer */}
        <section className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Your Creations</h2>
            <div className="relative group">
                <button onClick={() => handleCarouselScroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/70 dark:bg-slate-800/70 rounded-full border-2 border-black shadow-cartoon-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20" disabled={carouselIndex === 0}>
                    <Icon name="arrow-left" className="w-6 h-6"/>
                </button>
                <div ref={carouselRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 py-4 px-2">
                    {allItems.map((item, index) => (
                        <div key={item.id} className={`snap-center flex-shrink-0 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 rounded-3xl transition-all duration-300 ${index === carouselIndex ? 'transform scale-105' : ''}`}>
                           {'caption' in item ? (
                                <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-cartoon border-2 border-black overflow-hidden h-full transition-shadow ${index === carouselIndex ? 'shadow-brand-accent/50 shadow-lg' : ''}`}>
                                    <img src={item.url} alt="Superhero Scene" className="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105"/>
                                    <p className="p-4 text-slate-800 dark:text-slate-200 font-semibold text-lg bg-amber-50 dark:bg-slate-700/50 border-t-2 border-black">"{item.caption}"</p>
                                </div>
                           ) : (
                                <div className={`aspect-square rounded-2xl border-2 border-black shadow-cartoon-sm p-1 bg-white transition-all overflow-hidden h-full ${index === carouselIndex ? 'shadow-brand-accent/50 shadow-lg border-brand-accent' : 'hover:transform hover:-rotate-3'}`}>
                                    <img src={item.url} alt="Cartoon Avatar" className="w-full h-full object-cover rounded-lg" />
                                </div>
                           )}
                        </div>
                    ))}
                </div>
                <button onClick={() => handleCarouselScroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/70 dark:bg-slate-800/70 rounded-full border-2 border-black shadow-cartoon-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20" disabled={carouselIndex === allItems.length -1}>
                    <Icon name="arrow-right" className="w-6 h-6"/>
                </button>
                 <div className="flex justify-center items-center mt-4 gap-2">
                    {allItems.map((_, index) => (
                        <button key={index} onClick={() => scrollToIndex(index)} className={`w-3 h-3 rounded-full border border-black transition-transform transform hover:scale-110 ${index === carouselIndex ? 'bg-black scale-125' : 'bg-slate-300'}`}>
                           <span className="sr-only">Go to item {index + 1}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>


        <div className="text-center mt-12 space-y-4">
            <ActionButton onClick={onRestart} className="bg-brand-primary text-white text-xl px-8 py-4">
                <Icon name="arrow-path" />
                Create Another Hero
            </ActionButton>
            <div>
                <ActionButton onClick={handleDownloadAll} disabled={isDownloading} className="bg-green-600 text-white text-base">
                    {isDownloading ? <Spinner className="w-5 h-5"/> : <Icon name="arrow-down-tray" />}
                    {isDownloading ? 'Generating Collage...' : 'Download All Creations'}
                </ActionButton>
            </div>
            <div>
                 <ActionButton onClick={() => setShowDeleteModal(true)} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm px-4 py-2">
                    Request Data Deletion
                </ActionButton>
            </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
                {toastMessage}
            </div>
        )}

        {/* Modals */}
        {showShareModal && (
            <Modal title={`Share ${customization.heroName || 'Your Hero'}`} onClose={() => setShowShareModal(false)}>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Copy this link to share your creation. The link will be active for 24 hours.</p>
                <div className="flex gap-2">
                    <input type="text" readOnly value={shareableLink} className="w-full p-2 border-2 border-black rounded-lg bg-slate-100 dark:bg-slate-700 dark:border-slate-600 focus:ring-0"/>
                    <ActionButton onClick={handleCopyLink} className="bg-brand-primary text-white text-base">Copy</ActionButton>
                </div>
            </Modal>
        )}
        {showDeleteModal && (
            <Modal title="Request Data Deletion" onClose={() => setShowDeleteModal(false)}>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Are you sure? This will permanently delete all your uploaded photos and generated results from our servers. This action cannot be undone.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <ActionButton onClick={() => setShowDeleteModal(false)} className="text-base bg-slate-200 dark:bg-slate-600">Cancel</ActionButton>
                    <ActionButton onClick={handleDeleteRequest} disabled={isDeleting} className="text-base bg-red-600 text-white">
                        {isDeleting ? <Spinner className="w-5 h-5"/> : <Icon name="trash" className="w-5 h-5" />}
                        {isDeleting ? 'Deleting...' : 'Yes, Delete My Data'}
                    </ActionButton>
                </div>
            </Modal>
        )}
    </div>
  );
};

export default ResultsPage;