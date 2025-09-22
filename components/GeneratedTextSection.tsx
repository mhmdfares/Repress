import React, { useState } from 'react';
import { Source } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface GeneratedTextSectionProps {
    isLoading: boolean;
    generatedText: string;
    setGeneratedText: (text: string) => void;
    sources: Source[];
    onRegenerate: () => void;
}

export const GeneratedTextSection: React.FC<GeneratedTextSectionProps> = ({
    isLoading,
    generatedText,
    setGeneratedText,
    sources,
    onRegenerate,
}) => {
    const [copySuccess, setCopySuccess] = useState('');

    const readAloud = () => {
        if (!generatedText) return alert("لا يوجد نص للقراءة.");
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(generatedText);
            utterance.lang = 'ar-SA';
            window.speechSynthesis.speak(utterance);
        } else {
            alert("عذرًا، متصفحك لا يدعم قراءة النص.");
        }
    };

    const copyText = () => {
        if (!generatedText) return;
        navigator.clipboard.writeText(generatedText).then(() => {
            setCopySuccess('تم نسخ النص!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('فشل النسخ.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const shareText = () => {
        if (!generatedText) return;
        if (navigator.share) {
            navigator.share({
                title: 'نص مولد بالذكاء الاصطناعي',
                text: generatedText,
            }).catch(console.error);
        } else {
            alert("المشاركة غير مدعومة في هذا المتصفح.");
        }
    };

    return (
        <div className="bg-card-secondary p-6 rounded-xl shadow-lg relative animate-fade-in">
            {isLoading && !generatedText ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <LoadingSpinner />
                    <p className="mt-4 text-text-muted">...جاري توليد النص</p>
                </div>
            ) : (
                <>
                    <div className="actions absolute top-6 end-6 flex gap-4">
                        <button onClick={readAloud} title="قراءة النص" className="text-primary hover:text-primary-hover text-2xl transition"><i className="fas fa-volume-up"></i></button>
                        <button onClick={copyText} title="نسخ النص" className="text-primary hover:text-primary-hover text-2xl transition"><i className="fas fa-copy"></i></button>
                        <button onClick={shareText} title="مشاركة النص" className="text-primary hover:text-primary-hover text-2xl transition"><i className="fas fa-share-alt"></i></button>
                        {copySuccess && <span className="absolute top-[-25px] end-0 bg-slate-800 text-white text-xs rounded py-1 px-2">{copySuccess}</span>}
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-4">النص المولد:</h3>
                    <textarea
                        id="generatedText"
                        value={generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        placeholder="...سيظهر النص المولد هنا"
                        className="w-full h-48 p-4 bg-white border-2 border-slate-300 rounded-lg text-text-strong placeholder-slate-400 text-base resize-vertical focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                    
                    {sources.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-bold text-text-muted">المصادر:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {sources.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {source.title || source.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <button
                        onClick={onRegenerate}
                        className="regenerate-button mt-4 w-full max-w-xs mx-auto block bg-secondary text-white font-bold py-3 px-6 rounded-lg cursor-pointer text-lg transition-all duration-300 ease-in-out hover:bg-secondary-hover shadow-md hover:shadow-lg"
                    >
                        إعادة التوليد بتعليمات إضافية
                    </button>
                </>
            )}
        </div>
    );
};