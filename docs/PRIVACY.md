# Privacy

ABMVSC Portfolio Engine is a product of ABMVSC Technology & Innovation Studio.

This page explains, in plain words, what happens to the details you type and the
files you upload. It is short because there is not much to explain: your details
stay on your own device.

## The short version

Nothing is uploaded. There is no server, no account and no analytics. The
generator runs inside your browser and the finished website is built in the same
tab. Your details never reach us or anyone else.

## What happens to what you type

Every answer you give in the generator is held in the browser tab you are using.
The generator saves a draft to your own browser's local storage so that closing
the tab does not lose your work. That draft sits in your browser on your
computer. Clearing your browser data, or using the "Start from scratch" button,
removes it.

Switching to a different browser or a different computer does not carry the
draft across. Nothing is synced and nothing is sent.

## Your photo and resume

When you choose a photo or a resume, the file is read straight into the tab. It
is shown back to you as a preview and then written into the ZIP file that you
download. The file is never sent anywhere. If you close the tab without
downloading, nothing was kept.

## The website you download

The ZIP you download is a normal folder of static files. It contains your pages,
the styles, the script, your photo and your resume, and one file that holds the
details you typed. When you put that folder online, your host serves those files
to visitors. That is the only time your details become visible to anyone, and
only because you chose to publish them.

Nothing in the downloaded site tracks visitors. There is no analytics, no
advertising and no outside script. The chat bubble on the site answers from the
text already on the page; it does not call any outside service.

## What this project does not do

- It does not run a server or a database.
- It does not create an account or ask you to sign in.
- It does not use cookies for tracking.
- It does not load fonts, scripts or images from another company's servers.
- It does not phone home when you open the generator.

## How we know this

The test suite fails the build if a page tries to load anything from outside the
folder, or if a runtime dependency or a build step is added. Those checks run on
every change, so the promises above are enforced rather than just written down.

## Questions

If you find a privacy problem, report it through the private vulnerability
reporting link on the repository's Security tab, as described in
[SECURITY.md](../SECURITY.md). Please do not open a public issue for anything
that could affect other users.
