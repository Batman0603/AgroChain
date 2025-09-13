import QRCode from 'qrcode';

export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrCodeUrl = await QRCode.toDataURL(text, {
      width: 200,
      margin: 1,
      color: {
        dark: '#22c55e',
        light: '#ffffff'
      }
    });
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}