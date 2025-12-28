export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { image } = req.body;
  
  // Mengambil data dari Environment Variables Vercel
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  try {
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: image,
        upload_preset: "ml_default", // Ganti jika nama preset kamu berbeda
        api_key: apiKey
      })
    });

    const uploadData = await uploadRes.json();

    // Link manipulasi HD: Menajamkan (e_sharpen) & Memperbesar (w_2000)
    const hdUrl = uploadData.secure_url.replace("/upload/", "/upload/e_sharpen:100,q_auto:best,w_2000,c_scale/");

    res.status(200).json({ url: hdUrl });
  } catch (error) {
    res.status(500).json({ error: "Gagal memproses gambar." });
  }
}
