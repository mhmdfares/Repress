import React, { useState, useEffect } from 'react';
import { UserData } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: UserData;
    onSaveUserData: (newUserData: UserData) => void;
    savedCustomTargets: string[];
    onDeleteCustomTarget: (target: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    userData,
    onSaveUserData,
    savedCustomTargets,
    onDeleteCustomTarget,
}) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [localUserData, setLocalUserData] = useState<UserData>(userData);

    useEffect(() => {
        setLocalUserData(userData);
    }, [userData]);
    
    if (!isOpen) return null;

    const handleSave = () => {
        onSaveUserData(localUserData);
        onClose();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalUserData(prev => ({ ...prev, [name]: value }));
    };

    const inputStyles = "w-full p-2 bg-white border-2 border-slate-300 rounded-lg text-text-strong placeholder-slate-400 text-base focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-primary">الإعدادات</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
                </header>
                
                <div className="flex border-b border-slate-200">
                    <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 font-semibold ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>ملف المستخدم</button>
                    <button onClick={() => setActiveTab('targets')} className={`px-6 py-3 font-semibold ${activeTab === 'targets' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>الأهداف المخصصة</button>
                </div>

                <main className="p-6" style={{maxHeight: '60vh', overflowY: 'auto'}}>
                    {activeTab === 'profile' && (
                        <div className="space-y-4">
                            <p className="text-text-muted">هذه المعلومات تساعد الذكاء الاصطناعي على تخصيص المحتوى لك عند تفعيل خيار "استخدام معلوماتي المخصصة".</p>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-1">اللغة المفضلة</label>
                                <input type="text" name="language" value={localUserData.language} onChange={handleInputChange} className={inputStyles}/>
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-text-secondary mb-1">النبرة المفضلة</label>
                                <input type="text" name="tone" value={localUserData.tone} onChange={handleInputChange} className={inputStyles}/>
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-text-secondary mb-1">اللهجة المفضلة</label>
                                <input type="text" name="dialect" value={localUserData.dialect} onChange={handleInputChange} className={inputStyles}/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-1">اهتمامات (مفصولة بفاصلة)</label>
                                <input type="text" name="interests" value={localUserData.interests} onChange={handleInputChange} className={inputStyles}/>
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-text-secondary mb-1">برومبت مخصص (تعليمات دائمة)</label>
                                <textarea name="customPrompt" value={localUserData.customPrompt} onChange={handleInputChange} className={`${inputStyles} h-24`} placeholder="مثال: أنا خبير تسويق وأكتب لجمهور من المبتدئين..."></textarea>
                            </div>
                        </div>
                    )}
                    {activeTab === 'targets' && (
                        <div className="space-y-3">
                             {savedCustomTargets.length > 0 ? (
                                savedCustomTargets.map(target => (
                                    <div key={target} className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
                                        <span className="text-text-strong">{target}</span>
                                        <button onClick={() => onDeleteCustomTarget(target)} className="text-danger hover:text-danger-hover font-semibold">حذف</button>
                                    </div>
                                ))
                             ) : (
                                <p className="text-text-muted text-center py-4">لا يوجد أهداف مخصصة محفوظة.</p>
                             )}
                        </div>
                    )}
                </main>

                <footer className="flex justify-end p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                    <button onClick={onClose} className="py-2 px-5 text-text-secondary font-semibold rounded-lg hover:bg-slate-200 transition">إلغاء</button>
                    <button onClick={handleSave} className="py-2 px-5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition mr-2">حفظ التغييرات</button>
                </footer>
            </div>
        </div>
    );
};