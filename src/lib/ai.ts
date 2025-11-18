export type AiCategory = 'docs' | 'pdfs' | 'images' | 'videos' | 'zips' | 'misc';

export interface AiSuggestion {
  category: AiCategory;
  title: string;
}

const mockNames: Record<AiCategory, string[]> = {
  docs: ['Project Notes', 'Meeting Minutes', 'Research Summary'],
  pdfs: ['Statement', 'Assignment', 'Ticket'],
  images: ['Sunset Memory', 'Family Shot', 'Screenshot'],
  videos: ['Travel Clip', 'Birthday Laughs', 'Workshop Recording'],
  zips: ['Archive', 'Backup Bundle', 'Reference Pack'],
  misc: ['Resource', 'Drop', 'Capture']
};

export const aiNameDocument = async (): Promise<AiSuggestion> => {
  return mockResponder('docs');
};

export const aiNameImage = async (): Promise<AiSuggestion> => {
  return mockResponder('images');
};

export const aiNameVideo = async (): Promise<AiSuggestion> => {
  return mockResponder('videos');
};

const mockResponder = async (category: AiCategory): Promise<AiSuggestion> => {
  const options = mockNames[category];
  const title = options[Math.floor(Math.random() * options.length)];
  return { category, title };
};
