# How to Upload to GitHub

Follow these steps to upload your **Sweet Shop Management System** to a GitHub repository.

## Prerequisites
1.  **Git Installed**: Ensure Git is installed (`git --version`).
2.  **GitHub Account**: You need an account on [github.com](https://github.com).

---

## Step 1: Initialize Git (If not already done)
Open your terminal in the project root folder (`incubyte_assignment`) and run:

```bash
git init
```
*(If you already see a `.git` folder, you can skip this.)*

## Step 2: Stage and Commit Files
Add all your project files to the Git staging area.

```bash
git add .
```

Commit the files with a message.

```bash
git commit -m "Initial commit of Sweet Shop App"
```

## Step 3: Create a Repository on GitHub
1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  **Repository name**: e.g., `sweet-shop-manager`.
4.  **Privacy**: Public or Private (your choice).
5.  **Do NOT** check "Add a README", ".gitignore", or "license" (we already have them).
6.  Click **Create repository**.

## Step 4: Link and Push
Copy the commands shown on the GitHub page under **"…or push an existing repository from the command line"**.

It will look something like this (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/sweet-shop-manager.git
git branch -M main
git push -u origin main
```

## Step 5: Verify
Refresh your GitHub repository page. You should see all your code uploaded!

---

## Troubleshooting
- **"Remote origin already exists"**: Run `git remote remove origin` and try adding it again.
- **"Permission denied"**: Ensure you are logged in to Git (`git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`).
