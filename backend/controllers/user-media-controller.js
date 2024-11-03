import path from "path";
const fs = require('fs').promises;
const { createReadStream } = require('fs');

/**
 * Streams HLS video content (.m3u8 playlists and .ts segments) to the client.
 * 
 * This function handles streaming of both playlist files (.m3u8) and video segments (.ts)
 * created by FFmpeg's HLS segmentation. It currently implements basic streaming without
 * range request support.
 * 
 * @example
 * // Usage in Express route
 * router.get("/stream/:mediaPath", streamMedia);
 * 
 * @todo Future improvements:
 * - Implement HTTP range requests support for better seeking and bandwidth management
 * - Add content-range headers for partial content responses (HTTP 206)
 * - Handle byte-range requests with proper chunking
 * - Add ETag support for caching
 * - Implement bandwidth throttling for large files
 * - Add support for adaptive bitrate streaming
 */
const streamMedia = async (req, res) => {
  try {
    if (!req.userId) {
      res.status(400).send({
        message: "Invalid User Token, please log in again!",
      });
      return;
    }
    
    const mediaPath = req.params.mediaPath;
    const pageId = req.params.pageId;
  
    if (!mediaPath || !pageId) {
      return res.status(400).send('Missing media path or page ID');
    }

    const videoDir = path.join(__dirname, '..', 'videos', pageId);
    const filePath = path.join(videoDir, mediaPath);

    console.log(`Streaming request received for: ${mediaPath}`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).send('File not found');
    }

    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch (err) {
      console.error(`Error getting file stats: ${filePath}`);
      return res.status(500).send('Error getting file stats');
    }

    const fileSize = stat.size;

    // Check for empty files
    if (fileSize === 0) {
      console.error(`Empty file detected: ${filePath}`);
      return res.status(422).send('Empty media file');
    }

    // For m3u8 files, validate content
    if (mediaPath.endsWith('.m3u8')) {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Check for invalid duration
      if (content.includes('#EXTINF:0.000000,')) {
        console.error(`Invalid m3u8 file detected (0 duration): ${filePath}`);
        return res.status(422).send('Invalid media file');
      }

      // Check for basic m3u8 structure
      if (!content.includes('#EXTM3U') || !content.includes('#EXT-X-VERSION')) {
        console.error(`Invalid m3u8 format: ${filePath}`);
        return res.status(422).send('Invalid media format');
      }

      res.writeHead(200, {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Content-Length': fileSize,
        'Cache-Control': 'no-cache'
      });
    } else if (mediaPath.endsWith('.ts')) {
      // For ts files, check minimum size
      const MIN_TS_SIZE = 1024; // 1KB minimum size for valid ts file
      if (fileSize < MIN_TS_SIZE) {
        console.error(`TS file too small: ${filePath} (${fileSize} bytes)`);
        return res.status(422).send('Invalid media segment');
      }

      res.writeHead(200, {
        'Content-Type': 'video/MP2T',
        'Content-Length': fileSize,
        'Cache-Control': 'no-cache'
      });
    } else {
      return res.status(400).send('Unsupported file type');
    }

    // Create read stream and pipe to response
    const stream = createReadStream(filePath);
    
    // Handle stream errors
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).send('Error streaming video');
      }
    });

    // Add timeout to the stream
    const timeout = setTimeout(() => {
      if (!res.writableEnded) {
        stream.destroy();
        if (!res.headersSent) {
          res.status(408).send('Stream timeout');
        }
      }
    }, 10000); // 10 second timeout

    // Clean up on stream end
    stream.on('end', () => {
      clearTimeout(timeout);
    });

    // Pipe the file to the response
    stream.pipe(res);

  } catch (error) {
    console.error('Error streaming video:', error);
    if (!res.headersSent) {
      res.status(500).send('Error streaming video');
    }
  }
};

export default {
  streamMedia
};
