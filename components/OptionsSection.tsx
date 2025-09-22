import React from 'react';

interface OptionsSectionProps {
    useInternet: boolean;
    setUseInternet: (value: boolean) => void;
    useUserData: boolean;
    setUseUserData: (value: boolean) => void;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({
    useInternet,
    setUseInternet,
    useUserData,
    setUseUserData
}) => {
    return (
        <div className="space-y-4 py-6 px-2">
            <div className="flex items-center">
                 <i className={`fas fa-globe text-2xl me-3 cursor-pointer ${useInternet ? 'text-primary' : 'text-gray-400'}`} onClick={() => setUseInternet(!useInternet)}></i>
                <label className="flex items-center text-lg text-text-secondary cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useInternet}
                        onChange={(e) => setUseInternet(e.target.checked)}
                        className="checkbox w-5 h-5 me-3 accent-primary"
                    />
                    استخدام الإنترنت في توليد النص
                </label>
            </div>
            <div className="flex items-center">
                 <i className={`fas fa-user-check text-2xl me-3 cursor-pointer ${useUserData ? 'text-primary' : 'text-gray-400'}`} onClick={() => setUseUserData(!useUserData)}></i>
                <label className="flex items-center text-lg text-text-secondary cursor-pointer">
                    <input
                        type="checkbox"
                        checked={useUserData}
                        onChange={(e) => setUseUserData(e.target.checked)}
                        className="checkbox w-5 h-5 me-3 accent-primary"
                    />
                    استخدام معلوماتي المخصصة
                </label>
            </div>
        </div>
    );
};