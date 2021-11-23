import { NextApiHandler } from 'next';
import youtubedl from 'youtube-dl-exec';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      statusCode: 405,
      message: 'Not Valid',
    });
  }
  const { videoUrl } = JSON.parse(req.body);
  if (!videoUrl.match(/^https:\/\//)) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Not Valid',
    });
  }
  try {
    const info = await youtubedl(videoUrl, { 'dump-json': true });
    const options = info.formats.map(({ filesize, format, height, width, url, ext }) => ({
      filesize,
      name: format,
      format: ext,
      height,
      width,
      url,
    }));
    console.log('Sending links for url: ', videoUrl);
    res.send({ title: info.title, options });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e });
  }
};

export default handler;
