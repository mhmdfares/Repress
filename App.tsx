import React, { useState, useCallback, useEffect } from 'react';
import { Target, Condition, Source, ConditionType, UserData } from './types';
import { conditionOptions, targetPresets, initialUserData } from './constants';
import { generateContent } from './services/geminiService';
import { TargetSection } from './components/TargetSection';
import { ConditionsSection } from './components/ConditionsSection';
import { OptionsSection } from './components/OptionsSection';
import { GeneratedTextSection } from './components/GeneratedTextSection';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [target, setTarget] = useState<Target>('facebook');
    const [customTarget, setCustomTarget] = useState<string>('');
    const [savedCustomTargets, setSavedCustomTargets] = useState<string[]>([]);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [useInternet, setUseInternet] = useState<boolean>(false);
    const [useUserData, setUseUserData] = useState<boolean>(false);
    const [generatedText, setGeneratedText] = useState<string>('');
    const [sources, setSources] = useState<Source[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [currentUserData, setCurrentUserData] = useState<UserData>(initialUserData);

    // Effect to automatically set conditions based on the selected target
    useEffect(() => {
        const presets = targetPresets[target as keyof typeof targetPresets];
        if (presets) {
            const newConditions = presets.map((preset, index) => ({
                id: Date.now() + index, // Ensure unique ID
                type: preset.type,
                value: preset.value,
            }));
            setConditions(newConditions);
        } else {
            setConditions([]); // Clear conditions for custom targets or those without presets
        }
    }, [target]);


    const handleAddCondition = useCallback(() => {
        const addedTypes = new Set(conditions.map(c => c.type));
        const availableCondition = Object.keys(conditionOptions).find(key => !addedTypes.has(key as ConditionType));
        
        if (availableCondition) {
            const newType = availableCondition as ConditionType;
            let defaultValue = conditionOptions[newType][0] || '';
            if (newType === 'seoKeywords') defaultValue = ''; // Default for text input

            setConditions(prev => [...prev, {
                id: Date.now(),
                type: newType,
                value: defaultValue
            }]);
        } else {
            alert("تمت إضافة جميع الشروط المتاحة.");
        }
    }, [conditions]);

    const handleRemoveCondition = useCallback((id: number) => {
        setConditions(prev => prev.filter(c => c.id !== id));
    }, []);

    const handleConditionChange = useCallback((id: number, newCondition: Partial<Condition>) => {
        setConditions(prev => prev.map(c => c.id === id ? { ...c, ...newCondition } : c));
    }, []);
    
    const handleSaveCustomTarget = useCallback(() => {
        if (customTarget && !savedCustomTargets.includes(customTarget)) {
            setSavedCustomTargets(prev => [...prev, customTarget]);
            setTarget(customTarget as Target);
            setCustomTarget('');
        }
    }, [customTarget, savedCustomTargets]);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError('الرجاء إدخال نص أولاً.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedText('');
        setSources([]);

        const finalTarget = target === 'custom' ? customTarget : target;

        try {
            const result = await generateContent({
                inputText,
                target: finalTarget,
                conditions,
                useInternet,
                useUserData,
                userData: currentUserData
            });
            setGeneratedText(result.text);
            if (result.sources) {
                setSources(result.sources);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRegenerate = async () => {
        const additionalInstructions = prompt("أدخل تعليمات إضافية لإعادة توليد النص:");
        if (!additionalInstructions) return;

        setIsLoading(true);
        setError(null);
        
        try {
            const result = await generateContent({
                inputText: generatedText, // Use previously generated text as new input
                target: "Refine the text based on new instructions",
                conditions: [{ type: 'custom', value: `Instructions: ${additionalInstructions}`, id: 0}],
                useInternet,
                useUserData: false, // User data might not be relevant for regeneration
                userData: currentUserData
            });
            setGeneratedText(result.text);
            setSources(result.sources || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during regeneration.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-background min-h-screen font-sans text-text flex flex-col">
            <header className="bg-card shadow-md sticky top-0 z-10 w-full">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-magic-sparkles text-primary text-2xl"></i>
                        <h1 className="text-xl sm:text-2xl font-bold text-primary">إعادة صياغة النصوص بالذكاء الاصطناعي</h1>
                    </div>
                    <button onClick={() => setIsSettingsOpen(true)} className="text-slate-600 hover:text-primary transition-colors" title="الإعدادات">
                        <i className="fas fa-cog text-2xl"></i>
                    </button>
                </div>
            </header>

            {isSettingsOpen && (
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    userData={currentUserData}
                    onSaveUserData={setCurrentUserData}
                    savedCustomTargets={savedCustomTargets}
                    onDeleteCustomTarget={(targetToDelete) => {
                        setSavedCustomTargets(prev => prev.filter(t => t !== targetToDelete));
                        if(target === targetToDelete) setTarget('facebook'); // Reset target if deleted
                    }}
                />
            )}

            <div className="container max-w-7xl mx-auto p-4 sm:p-6 md:p-8 flex-grow w-full">
                <header className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text">أطلق العنان لإبداعك</h2>
                    <p className="text-text-secondary mt-2 text-lg">حوّل أفكارك إلى محتوى جذاب ومقنع بضغطة زر</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                    {/* --- Input Column --- */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="inputText" className="block text-lg font-bold text-text-secondary mb-3">النص الأصلي:</label>
                            <textarea
                                id="inputText"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="أدخل النص هنا..."
                                className="w-full h-36 p-4 bg-white border-2 border-slate-300 rounded-lg text-text-strong placeholder-slate-400 text-base resize-vertical focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                        </div>

                        <TargetSection
                            target={target}
                            setTarget={setTarget}
                            customTarget={customTarget}
                            setCustomTarget={setCustomTarget}
                            savedCustomTargets={savedCustomTargets}
                            onSaveCustomTarget={handleSaveCustomTarget}
                        />

                        <ConditionsSection
                            conditions={conditions}
                            onAddCondition={handleAddCondition}
                            onRemoveCondition={handleRemoveCondition}
                            onConditionChange={handleConditionChange}
                        />

                        <OptionsSection
                            useInternet={useInternet}
                            setUseInternet={setUseInternet}
                            useUserData={useUserData}
                            setUseUserData={setUseUserData}
                        />

                        <div className="pt-4">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="generate-button w-full bg-primary text-white font-bold py-4 px-6 rounded-lg cursor-pointer text-xl transition-all duration-300 ease-in-out hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                            >
                                {isLoading ? <LoadingSpinner /> : 'توليد النص'}
                            </button>
                        </div>
                    </div>

                    {/* --- Output Column --- */}
                    <div className="mt-8 lg:mt-0">
                         <div className="sticky top-24">
                            {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">{error}</div>}
                            
                            {(generatedText || isLoading || sources.length > 0) && (
                                <GeneratedTextSection
                                    isLoading={isLoading}
                                    generatedText={generatedText}
                                    setGeneratedText={setGeneratedText}
                                    sources={sources}
                                    onRegenerate={handleRegenerate}
                                />
                            )}
                         </div>
                    </div>
                </main>
            </div>
            
            <footer className="bg-slate-900 text-slate-300 text-center p-4 mt-auto">
                <p>&copy; 2024 - تم إنشاؤه باستخدام Google Gemini API</p>
            </footer>
        </div>
    );
};

export default App;