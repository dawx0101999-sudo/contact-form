# ISA3 Contact Form (TYBCA)

Static HTML/CSS/JS form + Vercel serverless function (`/api/contact`) + Supabase PostgreSQL database.

## Steps

### 1. Database (Supabase)
1. Sign up at supabase.com and create a new project.
2. Open **SQL Editor**, paste `schema.sql`, click **Run**.
3. Open **Project Settings > API**. Copy the **Project URL** and the **service_role** key.

### 2. GitHub
1. Create a new repository (e.g. `isa3-contact-form`) on github.com.
2. Upload all files (Add file > Upload files) or push using git:
   ```
   git init
   git add .
   git commit -m "Contact form"
   git branch -M main
   git remote add origin https://github.com/<username>/isa3-contact-form.git
   git push -u origin main
   ```

### 3. Vercel
1. Sign in at vercel.com with GitHub. Click **Add New > Project** and import the repo.
2. Framework Preset: **Other**. Leave build settings empty.
3. Under **Environment Variables** add:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_SERVICE_KEY` = your service_role key
4. Click **Deploy**. Open the live URL.

### 4. Test
Submit the form, then check **Supabase > Table Editor > contacts** for the new row.
