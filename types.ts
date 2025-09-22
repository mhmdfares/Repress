export type Target = 'facebook' | 'instagram' | 'article' | 'analysis' | 'custom' | string;

export type ConditionType = 
  | 'language' 
  | 'tone' 
  | 'dialect' 
  | 'emojis' 
  | 'audience' 
  | 'length' 
  | 'formality'
  | 'pointOfView'
  | 'format'
  | 'seoKeywords'
  | 'callToAction'
  | 'custom';

export interface Condition {
  id: number;
  type: ConditionType;
  value: string;
}

export interface Source {
  uri: string;
  title: string;
}

export interface UserData {
  language: string;
  tone: string;
  dialect: string;
  emojis: string;
  interests: string; // Stored as a comma-separated string for easier input management
  customPrompt: string;
}


export interface GenerateContentParams {
  inputText: string;
  target: string;
  conditions: Condition[];
  useInternet: boolean;
  useUserData: boolean;
  userData: UserData;
}