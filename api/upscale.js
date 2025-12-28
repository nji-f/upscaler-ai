export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { image } = req.body;
  
  // Mengambil data dari Environment Variables Vercel
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  try {
    // 1. Upload ke Cloudinary
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: image,
        upload_preset: "bbdgrm0u", // <--- Pastikan ini "Unsigned" di Cloudinary
        api_key: apiKey
      })
    });

    const uploadData = await uploadRes.json();

    if (uploadData.error) {
      return res.status(400).json({ error: uploadData.error.message });
    }

    // 2. Manipulasi Gambar: e_sharpen:100 (Tajam), q_auto:best (Kualitas), w_2000 (Lebar)
    // Kita mengganti "/upload/" di URL asli dengan parameter transformasi
    const hdUrl = uploadData.secure_url.replace("/upload/", "/upload/e_sharpen:100,q_auto:best,w_2000,c_scale/");

    return res.status(200).json({ url: hdUrl });
  } catch (error) {
    return res.status(500).json({ error: "Server Error: " + error.message });
  }
}
