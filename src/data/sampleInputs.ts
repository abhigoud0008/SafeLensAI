import type { MessageChannel } from '../types/safety';

export const SAFETY_TIPS_OF_THE_DAY: string[] = [
  'Receiving money via UPI or payment apps never requires entering your PIN or scanning a QR code.',
  'Read web links right before the first "/" to find the true website owner—subdomains on the left can be faked.',
  'If an unexpected message creates sudden panic or a 30-minute deadline, pause and verify through the official app.',
  'An HTTPS padlock means your connection is encrypted, not that the website belongs to the company it claims.',
  'Grant mobile permissions like Location and Camera using "While using the app" instead of "Always."',
  'Use a unique 4-word passphrase for your primary email—it is the master key for password resets.',
];

export interface SampleMessagePreset {
  id: string;
  label: string;
  channel: MessageChannel;
  text: string;
}

export const SAMPLE_MESSAGES: SampleMessagePreset[] = [
  {
    id: 'fake-job',
    label: 'Fake Job Offer (WhatsApp)',
    channel: 'whatsapp',
    text: 'Congratulations! Your profile was shortlisted for Remote Data Coordinator ($42/hr, no interview required). To confirm your slot within 2 hours, pay a refundable $25 registration fee at http://careers-amaz0n-onboarding.com/apply and reply with your bank details.',
  },
  {
    id: 'urgent-otp',
    label: 'Urgent Bank Alert (SMS)',
    channel: 'sms',
    text: 'URGENT SECURITY NOTICE: Your bank account will be suspended today due to unverified KYC. Share your 6-digit OTP or confirm immediately at http://chase-verify-alert.com/login to prevent account freeze.',
  },
  {
    id: 'routine-notice',
    label: 'Routine Reminder (Email)',
    channel: 'email',
    text: 'Hi team, just a reminder that our neighborhood community safety workshop starts tomorrow at 10:00 AM at the Oakridge Library. Feel free to bring any questions—no links or sign-in needed.',
  },
];

export const SAMPLE_URLS: Array<{ label: string; url: string }> = [
  { label: 'Lookalike Login (amaz0n-login.com)', url: 'http://amaz0n-login.com/verify-account' },
  { label: 'Misleading Subdomain', url: 'https://paypal.security-update-check.com/login' },
  { label: 'Official Amazon Help', url: 'https://www.amazon.com/gp/help/customer/display.html' },
];

export function generateSamplePermissionScreenshotDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 760;
  canvas.height = 520;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, 760, 520);

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(140, 36, 480, 448, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('QuickTorch Flashlight — App Permissions', 175, 86);

  ctx.fillStyle = '#475569';
  ctx.font = '15px sans-serif';
  ctx.fillText('Allow QuickTorch Flashlight to access the following:', 175, 118);

  const rows = [
    { name: 'Camera', desc: 'Take pictures and record video anytime' },
    { name: 'Contacts', desc: 'Read your saved names and phone numbers' },
    { name: 'Precise Location', desc: 'Access your exact GPS location in background' },
    { name: 'Notifications', desc: 'Send alerts and lock screen badges' },
  ];

  rows.forEach((row, idx) => {
    const y = 160 + idx * 72;
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.roundRect(175, y, 410, 56, 10);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(row.name, 195, y + 24);

    ctx.fillStyle = '#475569';
    ctx.font = '13px sans-serif';
    ctx.fillText(row.desc, 195, y + 44);
  });

  ctx.fillStyle = '#2563EB';
  ctx.beginPath();
  ctx.roundRect(410, 434, 175, 34, 8);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Allow All', 466, 456);

  return canvas.toDataURL('image/png');
}
