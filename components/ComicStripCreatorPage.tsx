
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { AvatarResult } from '../types';
import Icon from './Icon';

interface ComicItem {
  id: string;
  type: 'avatar' | 'sticker';
  url: string;
  x: number;
  y: number;
  width: number; // Use width instead of scale for easier resizing
  rotation: number;
  panelIndex: number;
}

interface SpeechBubble {
    id: string;
    text: string;
    x: number;
    y: number;
    panelIndex: number;
}

const stickers = [
    {id: 'sticker-bam', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNIDUwIDAgTCA2MCA0MCBMIDEwMCA1MCBMIDYwIDYwIEwgNTAgMTAwIEwgNDAgNjAgTCAwIDUwIEwgNDAgNDAgWiIgZmlsbD0iI0Y1OUUwQiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkZyZWRva2EiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjMwIiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QkFNITwvdGV4dD48L3N2Zz4='},
    {id: 'sticker-pow', url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNIDUwIDAgTCA2MCA0MCBMIDEwMCA1MCBMIDYwIDYwIEwgNTAgMTAwIEwgNDAgNjAgTCAwIDUwIEwgNDAgNDAgWiIgZmlsbD0iI0VDNDg5OSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkZyZWRva2EiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjMwIiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UE9XITwvdGV4dD48L3N2Zz4='},
];

interface ComicStripCreatorPageProps {
  avatars: AvatarResult[];
}

const ComicStripCreatorPage: React.FC<ComicStripCreatorPageProps> = ({ avatars }) => {
  const [items, setItems] = useState<ComicItem[]>([]);
  const [bubbles, setBubbles] = useState<SpeechBubble[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingBubbleId, setEditingBubbleId] = useState<string | null>(null);

  const comicRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<{
    type: 'move' | 'resize' | 'rotate';
    id: string;
    startX: number;
    startY: number;
    itemStart: { x: number; y: number; width: number; rotation: number };
    panelRect: DOMRect;
  } | null>(null);

  const handleDragStartAsset = (e: React.DragEvent, item: {id: string, url: string, type: 'avatar' | 'sticker'}) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    setSelectedId(null);
  };
  
  const handleDrop = (e: React.DragEvent, panelIndex: number) => {
    e.preventDefault();
    const itemJSON = e.dataTransfer.getData('application/json');
    if (!itemJSON) return;
    const item = JSON.parse(itemJSON);
    const panelRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((e.clientX - panelRect.left) / panelRect.width) * 100;
    const y = ((e.clientY - panelRect.top) / panelRect.height) * 100;

    const newItem: ComicItem = {
      ...item,
      id: `${item.type}-${Date.now()}`,
      panelIndex,
      x,
      y,
      width: 40, // percentage of panel width
      rotation: 0,
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const handleInteractionStart = (
    e: React.MouseEvent,
    type: 'move' | 'resize' | 'rotate',
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    const item = items.find(i => i.id === id) || bubbles.find(b => b.id === id);
    if (!item) return;

    const panel = e.currentTarget.closest('.comic-panel');
    if (!panel) return;

    interactionRef.current = {
      type,
      id,
      startX: e.clientX,
      startY: e.clientY,
      itemStart: { 
          x: item.x, 
          y: item.y, 
          width: 'width' in item ? item.width : 0, // bubbles don't resize/rotate
          rotation: 'rotation' in item ? item.rotation : 0 
      },
      panelRect: panel.getBoundingClientRect(),
    };
  };

  const deleteItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setItems(items.filter(item => item.id !== id));
    setBubbles(bubbles.filter(bubble => bubble.id !== id));
    setSelectedId(null);
  };

  const handleAddBubble = (panelIndex: number) => {
    const newBubble: SpeechBubble = { id: `bubble-${Date.now()}`, text: 'Hero time!', x: 50, y: 20, panelIndex };
    setBubbles(prev => [...prev, newBubble]);
    setSelectedId(newBubble.id);
    setEditingBubbleId(newBubble.id);
  };

  const updateBubbleText = (id: string, text: string) => {
    setBubbles(bubbles.map(b => b.id === id ? { ...b, text } : b));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactionRef.current) return;
      const { type, id, startX, startY, itemStart, panelRect } = interactionRef.current;
      const dx = ((e.clientX - startX) / panelRect.width) * 100;
      const dy = ((e.clientY - startY) / panelRect.height) * 100;

      if (type === 'move') {
        const isBubble = bubbles.some(b => b.id === id);
        if (isBubble) {
            setBubbles(prev => prev.map(b => b.id === id ? { ...b, x: itemStart.x + dx, y: itemStart.y + dy } : b));
        } else {
            setItems(prev => prev.map(i => i.id === id ? { ...i, x: itemStart.x + dx, y: itemStart.y + dy } : i));
        }
      } else if (type === 'resize') {
        setItems(prev => prev.map(i => i.id === id ? { ...i, width: Math.max(10, itemStart.width + dx) } : i));
      } else if (type === 'rotate') {
         setItems(prev => prev.map(i => i.id === id ? { ...i, rotation: itemStart.rotation + (e.clientX - startX) } : i));
      }
    };

    const handleMouseUp = () => {
      interactionRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [items, bubbles]);

  const handleExport = () => {
     if (comicRef.current) {
      setSelectedId(null); // Deselect before exporting
      setTimeout(() => { // Allow UI to update
          html2canvas(comicRef.current!, { useCORS: true, backgroundColor: '#000000' }).then(canvas => {
            const link = document.createElement('a');
            link.download = `my-hero-comic.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
          });
      }, 100);
    }
  };
  
  const AssetSidebar: React.FC = () => (
      <aside className="w-full lg:w-72 flex-shrink-0 bg-white dark:bg-slate-800 p-4 rounded-3xl border-4 border-black shadow-cartoon">
        <h3 className="text-2xl font-bold mb-4">Assets</h3>
        <div className="space-y-4">
            <div>
                <h4 className="font-bold text-lg mb-2">Avatars</h4>
                <div className="grid grid-cols-3 gap-2">
                    {avatars.map(avatar => (
                        <div key={avatar.id} draggable onDragStart={(e) => handleDragStartAsset(e, {...avatar, type: 'avatar'})} className="cursor-grab aspect-square bg-slate-200 rounded-lg p-1 border-2 border-black hover:scale-105 transition-transform">
                            <img src={avatar.url} className="w-full h-full object-cover rounded-md" alt="Avatar"/>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="font-bold text-lg mb-2">Stickers</h4>
                 <div className="grid grid-cols-3 gap-2">
                    {stickers.map(sticker => (
                        <div key={sticker.id} draggable onDragStart={(e) => handleDragStartAsset(e, {...sticker, type: 'sticker'})} className="cursor-grab aspect-square bg-slate-200 rounded-lg p-1 border-2 border-black hover:scale-105 transition-transform">
                            <img src={sticker.url} className="w-full h-full object-contain" alt="Sticker"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </aside>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-slide-in-up" onClick={() => setSelectedId(null)}>
      <AssetSidebar />
      <main className="flex-1">
        <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">Comic Strip Creator</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Drag assets into the panels to create your story!</p>
        </div>

        <div ref={comicRef} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-black border-4 border-black shadow-cartoon rounded-xl overflow-hidden">
          {[0, 1, 2].map(panelIndex => (
            <div 
                key={panelIndex} 
                className="comic-panel relative aspect-square bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-800 dark:to-indigo-900 border-2 border-white"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, panelIndex)}
            >
              {/* Render Items */}
              {items.filter(i => i.panelIndex === panelIndex).map(item => (
                <div 
                    key={item.id}
                    className="absolute cursor-move"
                    style={{
                        left: `${item.x}%`, top: `${item.y}%`, width: `${item.width}%`,
                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`
                    }}
                    onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                    onMouseDown={(e) => handleInteractionStart(e, 'move', item.id)}
                >
                  <img src={item.url} className="w-full h-auto object-contain pointer-events-none" alt="Comic item" />
                  {selectedId === item.id && (
                    <div className="absolute inset-0 border-2 border-dashed border-brand-primary pointer-events-none">
                      <div onMouseDown={(e) => deleteItem(e, item.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-white rounded-full cursor-pointer z-10 hover:scale-125 transition-transform"></div>
                      <div onMouseDown={(e) => handleInteractionStart(e, 'resize', item.id)} className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-500 border-2 border-white rounded-full cursor-se-resize z-10 hover:scale-125 transition-transform"></div>
                      <div onMouseDown={(e) => handleInteractionStart(e, 'rotate', item.id)} className="absolute -bottom-2 -left-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full cursor-alias z-10 hover:scale-125 transition-transform"></div>
                    </div>
                  )}
                </div>
              ))}
              {/* Render Bubbles */}
              {bubbles.filter(b => b.panelIndex === panelIndex).map(bubble => (
                    <div key={bubble.id} 
                        className="absolute p-2 rounded-lg border-2 border-black text-sm cursor-move" 
                        style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, transform: `translate(-50%, -50%)`, background: 'white', maxWidth: '80%' }}
                        onClick={(e) => { e.stopPropagation(); setSelectedId(bubble.id); }}
                        onDoubleClick={(e) => {e.stopPropagation(); setEditingBubbleId(bubble.id);}}
                        onMouseDown={(e) => handleInteractionStart(e, 'move', bubble.id)}
                    >
                        {editingBubbleId === bubble.id ? (
                            <input 
                                type="text"
                                value={bubble.text}
                                onChange={(e) => updateBubbleText(bubble.id, e.target.value)}
                                onBlur={() => setEditingBubbleId(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingBubbleId(null)}
                                className="bg-transparent outline-none p-0 border-0"
                                autoFocus
                            />
                        ) : (
                            <p>{bubble.text}</p>
                        )}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white" style={{filter: 'drop-shadow(0 1px 0 #000)'}}></div>
                         {selectedId === bubble.id && (
                             <div onMouseDown={(e) => deleteItem(e, bubble.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-white rounded-full cursor-pointer z-10 hover:scale-125 transition-transform"></div>
                         )}
                    </div>
                ))}
              <button onClick={() => handleAddBubble(panelIndex)} className="absolute bottom-2 right-2 bg-white/80 text-black rounded-full p-1 border-2 border-black text-xs font-bold hover:bg-white">
                + Bubble
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
            <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xl font-bold text-white bg-green-600 rounded-2xl border-2 border-black shadow-cartoon-sm hover:shadow-cartoon transition-all duration-200 transform hover:-translate-y-1 hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-green-500/50"
            >
            <Icon name="arrow-down-tray" />
            Export as JPG
            </button>
        </div>
      </main>
    </div>
  );
};

export default ComicStripCreatorPage;