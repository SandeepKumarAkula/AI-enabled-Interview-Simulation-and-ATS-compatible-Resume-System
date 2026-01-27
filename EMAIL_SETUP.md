# Email Setup Guide (Gmail)

## Quick Setup Steps

### 1. Generate Gmail App Password

Since you're using Gmail with 2-Factor Authentication (which is now required), you need an **App Password**:

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Google Account
3. Select app: **Mail**
4. Select device: **Windows Computer** (or Other)
5. Click **Generate**
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### 2. Update .env File

Open `.env` file and update these lines:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM=your-email@gmail.com
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with the 16-character app password (remove spaces). If you paste it with spaces, the app will automatically strip them.

### 3. Restart Server

After updating `.env`:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Testing

1. Go to: http://localhost:3000/auth/forgot
2. Enter an existing user email
3. Check your Gmail inbox (and spam folder)
4. Click the reset link

## Troubleshooting

**"Authentication failed"**
- Make sure you're using the App Password, not your regular Gmail password
- Remove any spaces from the app password

**"Connection timeout"**
- Check your internet connection
- Make sure port 587 is not blocked by firewall

**No email received**
- Check spam/junk folder
- Verify the email exists in your database
- Check server console for SMTP errors

## Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
```

### Custom SMTP
Ask your email provider for their SMTP settings.
