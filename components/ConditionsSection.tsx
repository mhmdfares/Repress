import React from 'react';
import { Condition, ConditionType } from '../types';
import { conditionOptions, conditionLabels } from '../constants';

interface ConditionsSectionProps {
    conditions: Condition[];
    onAddCondition: () => void;
    onRemoveCondition: (id: number) => void;
    onConditionChange: (id: number, newCondition: Partial<Condition>) => void;
}

const textInputConditions: ConditionType[] = ['seoKeywords', 'custom'];

export const ConditionsSection: React.FC<ConditionsSectionProps> = ({
    conditions,
    onAddCondition,
    onRemoveCondition,
    onConditionChange,
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">الشروط:</h3>
            <div id="conditionsContainer" className="space-y-3">
                {conditions.map(condition => {
                    const isTextInput = textInputConditions.includes(condition.type);
                    
                    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newType = e.target.value as ConditionType;
                        const newValue = textInputConditions.includes(newType) ? '' : conditionOptions[newType][0];
                        onConditionChange(condition.id, { type: newType, value: newValue });
                    };

                    return (
                        <div key={condition.id} className="condition flex flex-col sm:flex-row items-stretch gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <select
                                value={condition.type}
                                onChange={handleTypeChange}
                                className="w-full sm:w-1/3 p-2 bg-white border-2 border-slate-300 rounded-lg text-text-strong text-base focus:ring-2 focus:ring-primary focus:border-primary transition"
                            >
                                {Object.entries(conditionLabels).map(([key, label]) => (
                                    <option key={key} value={key} disabled={conditions.some(c => c.type === key && c.id !== condition.id)}>{label}</option>
                                ))}
                            </select>
                            
                            {isTextInput ? (
                                <input
                                    type="text"
                                    value={condition.value}
                                    onChange={(e) => onConditionChange(condition.id, { value: e.target.value })}
                                    placeholder={`أدخل ${conditionLabels[condition.type] || ''}...`}
                                    className="w-full sm:flex-grow p-2 bg-white border-2 border-slate-300 rounded-lg text-text-strong text-base focus:ring-2 focus:ring-primary focus:border-primary transition"
                                />
                            ) : (
                                <select
                                    value={condition.value}
                                    onChange={(e) => onConditionChange(condition.id, { value: e.target.value })}
                                    className="w-full sm:flex-grow p-2 bg-white border-2 border-slate-300 rounded-lg text-text-strong text-base focus:ring-2 focus:ring-primary focus:border-primary transition"
                                >
                                    {(conditionOptions[condition.type] || []).map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}

                            <button
                                onClick={() => onRemoveCondition(condition.id)}
                                className="delete-condition bg-danger text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-danger-hover w-full sm:w-auto flex-shrink-0"
                            >
                                حذف
                            </button>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={onAddCondition}
                className="add-condition bg-secondary text-white font-bold py-2 px-5 rounded-lg cursor-pointer text-base transition hover:bg-secondary-hover"
            >
                + إضافة شرط
            </button>
        </div>
    );
};