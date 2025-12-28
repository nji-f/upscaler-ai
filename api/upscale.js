export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST' });

  const { image } = req.body;
  
  // Memastikan data terambil dari Vercel Settings
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  try {
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: image,
        upload_preset: "ml_default", // <--- PASTIKAN INI "UNSIGNED" DI SETTING CLOUDINARY
        api_key: apiKey
      })
    });

    const uploadData = await uploadRes.json();

    if (uploadData.error) {
       return res.status(400).json({ error: uploadData.error.message });
    }

    // Teknik HD: Sharpen + High Quality + Resize ke 2000px
    const hdUrl = uploadData.secure_url.replace("/upload/", "/upload/e_sharpen:100,q_auto:best,w_2000,c_scale/");

    return res.status(200).json({ url: hdUrl });
  } catch (err) {
    return res.status(500).json({ error: "Server Error: " + err.message });
  }
}
