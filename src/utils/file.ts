export const file2Base64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = error => reject(error);
  })
}
export const encodeFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string
      // Remove the prefix from the result
      const base64String = result.split(",")[1] as string;
      resolve(base64String);
    };

    reader.onerror = error => reject(error);

    reader.readAsDataURL(file); // Read the file as a data URL
  });
}
