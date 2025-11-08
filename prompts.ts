
import { CustomizationOptions } from './types';

/**
 * Generates the main prompt for creating the superhero character image.
 * It incorporates the user's selected customization options.
 * @param options - The customization options selected by the user.
 * @returns A detailed string prompt for the image generation model.
 */
export const getCharacterPrompt = (options: CustomizationOptions): string => {
  const { style, color, pose } = options;

  const mainPrompt = `
    Create a high-quality 3D cartoon version of this child in a ${style} animation style.
    Preserve the child’s real facial identity, skin tone, and hairstyle from the reference photo.
    Make the character cute, expressive, and friendly with big glossy eyes and smooth skin shading.
    Dress the child as a unique superhero with a ${color} suit, a short cape, and a glowing emblem
    on the chest. The character should be in a "${pose}" pose.
    Add soft cinematic lighting, subtle rim highlights, and smooth depth-of-field.
    Place a magical, uplifting background with soft gradients and sparkles to match a storybook theme.
    Render at high resolution with clean edges, detailed textures, and proper anatomy.
    Style: ${style}-level polish, vibrant, playful, kid-friendly, positive energy.
  `;

  const negativePrompt = getNegativePrompt();

  return `${mainPrompt.trim()} \n\nIMPORTANT: ${negativePrompt}`;
};

/**
 * Generates the negative prompt to guide the model away from undesirable outputs.
 * @returns A string of negative keywords.
 */
export const getNegativePrompt = (): string => {
  return `
    Do not generate a deformed face, creepy eyes, mutated hands, blurry textures, or low-quality results. Avoid extra limbs, stretched features, weird shadows, NSFW content, scary, dark, or ugly themes. Do not include any text or watermarks.
  `.trim();
};
