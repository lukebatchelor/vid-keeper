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
  const info = await youtubedl(videoUrl, { 'dump-json': true });
  const options = info.formats.map(({ filesize, format, height, width, url }) => ({
    filesize,
    format,
    height,
    width,
    url,
  }));
  console.log({ options });
  res.send({ title: info.title, options });
};

export default handler;
