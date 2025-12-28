import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { image } = req.body;
    
    // Memanggil Model AI Real-ESRGAN untuk upscaling 4x
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c544932793d022d13342277240287259130605",
      { input: { image: image, scale: 4, face_enhance: true } }
    );

    res.status(200).json({ url: output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
