# Versioning

Version control is the only reasonable way to keep track of changes in code, manuscripts, presentations, and data analysis projects. 

## Versioning with Git (and Github)

At the core of IDISS for versioning is "Git". 

Git (/ɡɪt/) is an extremely popular software for tracking changes in any set of files, usually used for coordinating work among programmers collaboratively developing source code during software development. Its goals include speed, data integrity, and support for distributed, non-linear workflows (thousands of parallel branches running on different systems).

https://www.xml.com/articles/2021/06/20/using-github-collaborative-xml-publishing/

While Git/GitHub does well is store and version files it only views files as collections of lines. It does not understand "XML", "JSON", "ASN.1" or any other encoding or serialization. There is no validation inherent to Git/GitHub that ensures that any content submitted to it is well-formed, meaning that both good, valid DITA and malformed content are all the same to GitHub. That is where the IDISS editor enters the picture.

## IDIS Editor as front end to Github
The IDISS Editor is built on top of Microsoft's Visual Studio Code.
