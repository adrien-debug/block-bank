# Production Setup Guide

## Google Drive Configuration

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Drive API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

### Step 2: Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Click "Create and Continue"
5. Grant the service account the "Editor" role (or custom role with Drive permissions)
6. Click "Done"

### Step 3: Generate Service Account Key
1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file

### Step 4: Extract Credentials from JSON
From the downloaded JSON file, extract:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY` (keep the full key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

### Step 5: Create Google Drive Folder
1. Create a folder in your Google Drive (e.g., "BlockBank Submissions")
2. Share the folder with your service account email (from Step 3)
3. Give it "Editor" permissions
4. Get the folder ID from the URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the `FOLDER_ID_HERE` part → `GOOGLE_DRIVE_FOLDER_ID`

### Step 6: Configure Environment Variables
Create a `.env.local` file in the project root with:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id

# Admin Authentication
ADMIN_PASSWORD_HASH=your-bcrypt-hash-here
ADMIN_SESSION_SECRET=your-random-secret-key-here

NODE_ENV=production
```

**Important Notes:**
- The `GOOGLE_PRIVATE_KEY` must include the full key with newlines (`\n`)
- In `.env.local`, you can use actual newlines or `\n` characters
- Never commit `.env.local` to version control (it's in `.gitignore`)

## Admin Password Setup

### Generate Password Hash
Run this command to generate a bcrypt hash for your admin password:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password-here', 10).then(console.log)"
```

Replace `your-password-here` with your desired admin password, then copy the hash to `ADMIN_PASSWORD_HASH`.

### Generate Session Secret
Generate a random secret for session management:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `ADMIN_SESSION_SECRET`.

## Production Deployment Checklist

- [ ] Google Drive API enabled
- [ ] Service Account created with Drive permissions
- [ ] Service Account key downloaded and credentials extracted
- [ ] Google Drive folder created and shared with service account
- [ ] `.env.local` file created with all required variables
- [ ] Admin password hash generated and configured
- [ ] Session secret generated and configured
- [ ] Test submission to verify Google Drive integration
- [ ] Test admin login to verify authentication
- [ ] All environment variables set in production hosting platform

## Testing

1. **Test Form Submission:**
   - Submit a test asset tokenization request
   - Verify files are uploaded to Google Drive
   - Check that metadata.json is created

2. **Test Admin Dashboard:**
   - Login with admin password
   - Verify you can see submissions
   - Check that documents are accessible

## Troubleshooting

### "Google Drive is not configured" Error
- Verify all three Google Drive environment variables are set
- Check that `GOOGLE_PRIVATE_KEY` includes the full key with headers
- Ensure the service account email matches the one in Google Cloud Console

### "Permission denied" Error
- Verify the service account has access to the Google Drive folder
- Check that the folder ID is correct
- Ensure the service account has "Editor" permissions on the folder

### Files not uploading
- Check Google Drive API quota limits
- Verify the service account has sufficient permissions
- Check server logs for detailed error messages


