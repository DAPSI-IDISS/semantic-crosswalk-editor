# Versioning

Version control is the only reasonable way to keep track of changes in code, manuscripts, presentations, and data analysis projects. 

## Versioning with Git (and Github)

At the core of IDISS for versioning is "Git". 

Git (/ɡɪt/) is an extremely popular software for tracking changes in any set of files, usually used for coordinating work among programmers collaboratively developing source code during software development. Its goals include speed, data integrity, and support for distributed, non-linear workflows (thousands of parallel branches running on different systems).

https://www.xml.com/articles/2021/06/20/using-github-collaborative-xml-publishing/

While Git/GitHub does well is store and version files it only views files as collections of lines. It does not understand "XML", "JSON", "ASN.1" or any other encoding or serialization. There is no validation inherent to Git/GitHub that ensures that any content submitted to it is well-formed, meaning that both good, valid DITA and malformed content are all the same to GitHub. That is where the IDISS editor enters the picture.

## IDIS Editor as front end to Github <IMG SRC="https://user-images.githubusercontent.com/408126/149361233-30279d28-280a-4bd3-b988-f314a0fd4cc3.png" height="35">
The IDISS Editor is built on top of Microsoft's Visual Studio Code as an extension. . Visual Studio Code is a source-code editor made by Microsoft for Windows, Linux and macOS featuring syntax highlighting, intelligent code completion, snippets, code refactoring and embedded Git. 

The platform was chosen in great part to its great popularity. In the Stack Overflow 2021 Developer Survey, Visual Studio Code was ranked the most popular developer environment tool, with 70% of 82,000 respondents reporting that they use it.

The editor extension is composed of two parts: a language server extension and a client extension. The server uses the Language Server Protocol (LSP), a common protocol based upon JSON RPC v2.0. It is used to provide language service features to various code editors and not just Visual Studio Code but also Emacs and a host of other editors.

Our client-side is predominantly TypeScript (VS Code is based on Electron which is a free and open-source software framework developed and maintained by GitHub for desktop applications using Web technology especially the Chromium engine and Node.js) while our server (LSP) makes heavy use of Java.

The editor provides a number of services including not just well-formed validation but also semantic validation/consistency to Git.
