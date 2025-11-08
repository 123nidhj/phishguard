# Firebase Setup Instructions

## To resolve the permission-denied error, you need to deploy the Firestore security rules:

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your existing Firebase project
   - Choose the default database
   - Accept the default rules file (firestore.rules)
   - Accept the default indexes file (firestore.indexes.json)

4. **Deploy the security rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Using Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Select your PhishGuard project
3. Go to Firestore Database
4. Click on the "Rules" tab
5. Replace the existing rules with the content from `firestore.rules`
6. Click "Publish"

### Option 3: Temporary Fix (For Development Only)

If you want to test immediately, you can temporarily use these rules in the Firebase Console:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // WARNING: These rules allow anyone to read/write. Use only for development!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANT: Don't use Option 3 in production!**

## Recommended Production Rules

The `firestore.rules` file in this project contains secure rules that:
- Allow users to only access their own data
- Require authentication for all operations
- Protect user privacy and data

## Features After Setup

Once the rules are deployed, the email scanner will:
- ✅ Save scan results to Firebase for authenticated users
- ✅ Automatically sync scan history across devices
- ✅ Fall back to localStorage if Firebase is unavailable
- ✅ Provide anonymous authentication option
- ✅ Clear both Firebase and local history

## Testing

1. Click "Enable Cloud Sync" in the Quick Actions
2. Perform an email scan
3. Check that the scan appears in "Recent Email Scans (Firebase)"
4. Refresh the page to verify data persistence
