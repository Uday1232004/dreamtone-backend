import pkg from 'yt-dlp-exec';
const { exec } = pkg;

export const searchSongs = async (query) => {
  try {
    // Improved search syntax for better reliability
    const results = await exec(`ytsearch15:"${query}"`, {
      dumpSingleJson: true,
      noPlaylist: true,
      flatPlaylist: true,
      format: 'bestaudio'
    });
    
    const entries = results.entries || [];
    
    // Map entries with safety checks
    return entries.map(entry => ({
      id: entry.id || '',
      title: entry.title || 'Unknown Title',
      artist: entry.uploader || 'Unknown Artist',
      thumbnail: entry.id ? `https://i.ytimg.com/vi/${entry.id}/hqdefault.jpg` : '',
      duration: entry.duration_string || '0:00',
      durationSeconds: entry.duration || 0
    })).filter(song => song.id !== ''); // Filter out invalid entries
    
  } catch (error) {
    console.error('Search service error:', error);
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
