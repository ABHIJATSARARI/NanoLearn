import React, { useState, useRef, useEffect } from 'react';
import { Wand2, FileText, AlertCircle, Loader2, BarChart3, X, File, CheckCircle2, BrainCircuit, Zap, GraduationCap, ChevronLeft } from 'lucide-react';
import { generateMicroLesson } from '../services/geminiService';
import { MicroLesson } from '../types';

interface LessonGeneratorProps {
  onLessonGenerated: (lesson: MicroLesson) => void;
  onCancel: () => void;
}

const LOADING_MESSAGES = [
  "Analyzing your content...",
  "Extracting key concepts...",
  "Crafting a 60-second summary...",
  "Generating quiz questions...",
  "Polishing your micro-lesson..."
];

export const LessonGenerator: React.FC<LessonGeneratorProps> = ({ onLessonGenerated, onCancel }) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; data: string; size: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    } else {
      setLoadingMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    if (!selectedFile) {
      if (!text.trim()) {
        setError('Please enter text or upload a document to generate a lesson.');
        return;
      }
      if (text.trim().length < 50) {
        setError('Text is too short. Please enter at least 50 characters for the AI to work with.');
        return;
      }
    }
    
    setLoading(true);
    setError('');
    
    try {
      let inputPayload;
      
      if (selectedFile) {
        inputPayload = {
          type: 'file' as const,
          mimeType: selectedFile.type,
          data: selectedFile.data
        };
      } else {
        inputPayload = {
          type: 'text' as const,
          content: text
        };
      }

      const lesson = await generateMicroLesson(inputPayload, difficulty);
      if (lesson) {
        onLessonGenerated(lesson);
      } else {
        setError('Failed to generate lesson. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('overloaded') || err?.status === 503) {
        setError('The AI tutor is currently experiencing high traffic. Please try again in a moment.');
      } else {
        setError('An error occurred while communicating with the AI tutor. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Please upload a file smaller than 10MB.');
      return;
    }

    const isDocx = file.name.toLowerCase().endsWith('.docx');
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isTxt = file.name.toLowerCase().endsWith('.txt');
    
    const isValidType = 
        file.type === 'text/plain' || 
        file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        isDocx || isPdf || isTxt;

    if (!isValidType) {
        setError('Unsupported file type. Please upload .txt, .pdf, or .docx');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(',')[1];
      
      let mimeType = file.type;
      if (isPdf && !mimeType) mimeType = 'application/pdf';
      if (isDocx && !mimeType) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (isTxt && !mimeType) mimeType = 'text/plain';

      setSelectedFile({
        name: file.name,
        type: mimeType || 'application/octet-stream',
        data: base64Data,
        size: formatFileSize(file.size)
      });
      setText(''); 
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center pb-24 animate-fade-in px-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl relative z-10 border border-indigo-100 dark:border-indigo-900/50">
            <BrainCircuit size={48} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 transition-all duration-500">
          {LOADING_MESSAGES[loadingMsgIndex]}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
          NanoLearn AI is transforming your content into a bite-sized lesson.
        </p>
        <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full animate-shine w-full origin-left"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-slide-up pb-32">
      <div className="flex items-center mb-6">
        <button 
            onClick={onCancel} 
            className="mr-3 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
            <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create Nano Lesson</h2>
      </div>

      <div className={`glass-panel rounded-3xl shadow-lg border p-5 mb-6 flex-grow flex flex-col relative transition-all duration-500 ${selectedFile ? 'border-green-400/50 dark:border-green-600/50 ring-4 ring-green-50 dark:ring-green-900/10' : 'border-white/60 dark:border-slate-700/50'}`}>
        {selectedFile ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed border-green-200 dark:border-green-800/50 rounded-2xl bg-green-50/50 dark:bg-green-900/10 animate-pop relative overflow-hidden group">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-full mb-4 shadow-md relative z-10 group-hover:scale-110 transition-transform duration-300">
              <File size={32} className="text-green-600 dark:text-green-400" />
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-800 animate-pop" style={{ animationDelay: '0.2s' }}>
                 <CheckCircle2 size={12} strokeWidth={3} />
              </div>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-center mb-1 break-all line-clamp-2 px-4 z-10">
              {selectedFile.name}
            </h3>
            <p className="text-green-700 dark:text-green-300 text-xs mb-6 font-medium z-10 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full">
               {selectedFile.size} • {selectedFile.type.split('/')[1]?.toUpperCase() || 'DOC'}
            </p>
            <button 
              onClick={clearFile}
              className="flex items-center text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium py-2.5 px-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md z-10 active:scale-95"
            >
              <X size={16} className="mr-2" />
              Remove File
            </button>
          </div>
        ) : (
          <textarea
            className="w-full flex-grow resize-none outline-none text-slate-700 dark:text-slate-200 text-lg placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-transparent leading-relaxed"
            placeholder="Paste your notes, textbook chapter, or essay here..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
          />
        )}
        
        <div className="border-t border-slate-100 dark:border-slate-800/50 pt-4 mt-4 flex justify-between items-center">
            <label className="flex items-center text-slate-500 dark:text-slate-400 text-sm cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors group">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg mr-2 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                  <FileText size={20} className="text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-medium">Upload Document</span>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".txt,text/plain,.pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
            </label>
            <span className={`text-xs font-medium transition-colors ${
              selectedFile 
                ? 'text-green-600 dark:text-green-400 font-bold flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md' 
                : (text.length > 0 && text.length < 50 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-600')
            }`}>
              {selectedFile ? (
                <>
                  <CheckCircle2 size={14} className="mr-1" />
                  Ready
                </>
              ) : (text.length === 0 ? '0 chars' : `${text.length} / 50 min`)}
            </span>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="mb-8">
        <div className="flex items-center mb-3 text-slate-700 dark:text-slate-300 font-bold text-sm px-1">
            <BarChart3 size={16} className="mr-2 text-indigo-500 dark:text-indigo-400" />
            Target Difficulty
        </div>
        <div className="flex gap-3">
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => {
            const icons = {
                Beginner: <Zap size={18} />,
                Intermediate: <BarChart3 size={18} />,
                Advanced: <GraduationCap size={18} />
            };
            return (
                <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-3 px-2 rounded-2xl text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 border-2 ${
                    difficulty === level
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600 dark:text-indigo-300 shadow-sm scale-105'
                    : 'bg-white dark:bg-slate-800 border-transparent text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                >
                <div className={difficulty === level ? 'animate-pop' : ''}>
                    {icons[level]}
                </div>
                {level}
                </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-4 flex items-center text-sm animate-shake border border-red-100 dark:border-red-900/50 shadow-sm">
          <AlertCircle size={20} className="mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        className="w-full py-4 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      >
        <Wand2 size={24} className="mr-2" />
        Generate Lesson
      </button>
    </div>
  );
}