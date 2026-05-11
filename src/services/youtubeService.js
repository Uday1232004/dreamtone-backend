import { exec } from 'yt-dlp-exec';

export const searchSongs = async (query) => {
  try {
    const results = await exec(`ytsearch15:${query}`, {
      dumpSingleJson: true,
      noPlaylist: true,
      flatPlaylist: true,
      format: 'bestaudio'
    });
    
    return (results.entries || []).map(entry => ({
      id: entry.id,
      title: entry.title,
      artist: entry.uploader,
      thumbnail: `https://i.ytimg.com/vi/${entry.id}/hqdefault.jpg`,
      duration: entry.duration_string || '0:00',
      durationSeconds: entry.duration || 0
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const getStreamUrl = async (id) => {
  try {
    const output = await exec(`https://www.youtube.com/watch?v=${id}`, {
      getUrl: true,
      format: 'bestaudio'
    });
    return output.trim();
  } catch (error) {
    console.error('Stream extraction error:', error);
    throw error;
  }
};

export const getMetadata = async (id) => {
  try {
    const result = await exec(`https://www.youtube.com/watch?v=${id}`, {
      dumpSingleJson: true,
      noPlaylist: true
    });
    return {
      id: result.id,
      title: result.title,
      artist: result.uploader,
      description: result.description,
      thumbnail: result.thumbnail
    };
  } catch (error) {
    console.error('Metadata error:', error);
    throw error;
  }
};
