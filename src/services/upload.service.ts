export async function uploadImg(files: any) {
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
  const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const formData = new FormData()
  formData.append('upload_preset', UPLOAD_PRESET)
  if (!files?.length) return
  formData.append('file', files[0])

  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })
    return await res.json()
  } catch (err) {
    return console.error(err)
  }
}
