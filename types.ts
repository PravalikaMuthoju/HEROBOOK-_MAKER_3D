
export enum Page {
  Dashboard = 'DASHBOARD',
  Landing = 'LANDING',
  Upload = 'UPLOAD',
  Review = 'REVIEW',
  Customize = 'CUSTOMIZE',
  Processing = 'PROCESSING',
  Results = 'RESULTS',
  ProfileCard = 'PROFILE_CARD',
  Settings = 'SETTINGS',
  Credits = 'CREDITS',
  ComicCreator = 'COMIC_CREATOR',
}

export interface ImageFile {
  id: string;
  file?: File;
  previewUrl: string;
  dataUrl: string;
  error?: string;
}

export type StyleOption = 'Pixar' | 'Chibi' | 'Comic';
export type ColorOption = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Purple';
export type PoseOption = 'Flying' | 'Power Stance' | 'Action Ready';
export type EmblemOption = 'Star' | 'Lightning' | 'Heart' | 'Circle';
export type HairColorOption = 'Black' | 'Brown' | 'Blonde' | 'Red' | 'Original';


export interface CustomizationOptions {
  style: StyleOption;
  color: ColorOption;
  pose: PoseOption;
  heroName: string;
  hairColor: HairColorOption;
  emblemShape: EmblemOption;
}

export const processSteps = [
  'Uploading Files',
  'Preprocessing Images',
  'Generating Story',
  'Stylizing Avatars',
  'Generating Scenes',
] as const;

export type ProcessStep = typeof processSteps[number];

export interface JobStatus {
  jobId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
  progress: number;
  currentStep: ProcessStep;
  log: string;
}

export interface AvatarResult {
  id: string;
  url: string; // Will be a data URL
}

export interface SceneResult {
  id: string;
  url: string; // Will be a data URL
  caption: string;
}

export interface Results {
  jobId: string;
  avatars: AvatarResult[];
  scenes: SceneResult[];
  zipUrl: string;
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'black';
    enableAnimations: boolean;
    generationQuality: 'normal' | 'eco';
    enableSounds: boolean;
}