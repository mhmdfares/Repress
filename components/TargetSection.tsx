import React from 'react';
import { Target } from '../types';
import { defaultTargets } from '../constants';

interface TargetSectionProps {
    target: Target;
    setTarget: (target: Target) => void;
    customTarget: string;
    setCustomTarget: (value: string) => void;
    savedCustomTargets: string[];
    onSaveCustomTarget: () => void;
}

export const TargetSection: React.FC<TargetSectionProps> = ({
    target,
    setTarget,
    customTarget,
    setCustomTarget,
    savedCustomTargets,
    onSaveCustomTarget,
}) => {
    
    return (
        <div className="space-y-4">
            <label htmlFor="target" className="block text-lg font-bold text-text-secondary">اختر الهدف:</label>
            <select
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value as Target)}
                className="w-full p-3 bg-white border-2 border-slate-300 rounded-lg text-text-strong text-base focus:ring-2 focus:ring-primary focus:border-primary transition"
            >
                {defaultTargets.map(group => (
                    <optgroup key={group.label} label={group.label}>
                        {group.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </optgroup>
                ))}
                
                {savedCustomTargets.length > 0 && (
                     <optgroup label="الأهداف المخصصة">
                        {savedCustomTargets.map(t => <option key={t} value={t}>{t}</option>)}
                    </optgroup>
                )}
               
                <option value="custom">هدف مخصص</option>
            </select>

            {target === 'custom' && (
                <div className="custom-target space-y-2 pt-2">
                    <input
                        type="text"
                        id="customTarget"
                        value={customTarget}
                        onChange={(e) => setCustomTarget(e.target.value)}
                        placeholder="أدخل الهدف المخصص..."
                        className="w-full p-3 bg-white border-2 border-slate-300 rounded-lg text-text-strong placeholder-slate-400 text-base focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                    <button 
                      onClick={onSaveCustomTarget} 
                      className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-secondary-hover"
                    >
                      حفظ الهدف
                    </button>
                </div>
            )}
        </div>
    );
};