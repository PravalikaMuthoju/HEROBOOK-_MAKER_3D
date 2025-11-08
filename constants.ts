import { StyleOption, ColorOption, PoseOption, HairColorOption, EmblemOption } from './types';

export const MAX_FILES = 10;
export const MIN_FILES = 5;
export const MIN_RESOLUTION = 250;
export const ACCEPTED_FILE_TYPES = 'image/jpeg, image/png, image/webp';

export const STYLE_OPTIONS: StyleOption[] = ['Pixar', 'Chibi', 'Comic'];
export const COLOR_OPTIONS: ColorOption[] = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
export const POSE_OPTIONS: PoseOption[] = ['Flying', 'Power Stance', 'Action Ready'];
export const HAIR_COLOR_OPTIONS: HairColorOption[] = ['Original', 'Black', 'Brown', 'Blonde', 'Red'];
export const EMBLEM_OPTIONS: EmblemOption[] = ['Lightning', 'Star', 'Heart', 'Circle'];
