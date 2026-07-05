# How to publish your custom Gumroad page

The file `profile.html` in this folder is a custom design for your Gumroad
storefront at **gumroad.com/buildyourdigitalcity**. Once published, it
replaces the default Gumroad profile look. It updates itself automatically
when you add or remove products — you never need to edit it.

Publishing takes about 2 minutes. You do it from your own computer
(Mac or Windows) using the Terminal app. Just copy and paste — you don't
need to understand the commands.

## Step 1 — Open a terminal

- **Mac:** press `Cmd + Space`, type `Terminal`, press Enter.
- **Windows:** press the Windows key, type `PowerShell`, press Enter.

## Step 2 — Install the Gumroad tool (first time only)

Copy this line, paste it into the terminal, press Enter:

```
curl -fsSL https://gumroad.com/install-cli.sh | bash
```

(On a Mac with Homebrew you can use `brew install antiwork/cli/gumroad` instead.)

## Step 3 — Log in to Gumroad

```
gumroad auth login
```

A browser window opens — log in with your Gumroad account and approve it.

## Step 4 — Get this file onto your computer

If you have the repository already, just make sure it's up to date.
Otherwise download `profile.html` from GitHub:
go to the repo → `gumroad` folder → `profile.html` → the download button —
and save it somewhere easy, like your Downloads folder.

Then, in the terminal, go to the folder where the file is. For example:

```
cd ~/Downloads
```

## Step 5 — Preview (safe, changes nothing)

```
gumroad user page preview ./profile.html --json --no-input --non-interactive
```

Look at the `sanitization_report` part of the answer. If it's empty or
says nothing was removed, you're good. If it lists removed things, stop
and send that output to Claude to fix.

## Step 6 — Publish

```
gumroad user page publish ./profile.html --json --no-input --non-interactive
```

That's it — your page is live. To see the public link:

```
gumroad user page url --json --jq '.profile.landing_url' --no-input --non-interactive
```

## If you ever want the old default page back

```
gumroad user page clear --yes --json --no-input --non-interactive
```
