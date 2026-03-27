import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, ChevronDown } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOpenNewWindow = () => {
    // Open a new window with a placeholder or actual tutorial URL
    window.open('https://devstratos.polarislabs.ai.kr/tutorial.mp4', '_blank', 'width=800,height=600');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] relative z-[201]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stratos-tutorial-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-slate-200 dark:border-slate-800">
          <h2 id="stratos-tutorial-title" className="text-xl font-bold text-slate-800 dark:text-white">STRATOS 튜토리얼</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-3 flex-1 overflow-y-auto">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            튜토리얼 영상으로 핵심 기능과 분석 흐름을 차근차근 익혀보세요.
          </p>
          
          {/* Video Player Placeholder */}
          <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-200 dark:border-slate-800">
            {/* Using a placeholder video or just a styled div if no actual video is provided */}
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
            >
              <source src="https://devstratos.polarislabs.ai.kr/tutorial.mp4#t=0.001" type="video/mp4" />
              Your browser does not support HTML video.
            </video>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label htmlFor="playbackRate" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              재생속도
            </label>
            <div className="relative">
              <select
                id="playbackRate"
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="appearance-none bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block py-2 pl-3 pr-8"
              >
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2.0}>2.0x</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none dark:text-slate-500" />
            </div>
          </div>

          <button
            onClick={handleOpenNewWindow}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <span>새 창으로 보기</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
