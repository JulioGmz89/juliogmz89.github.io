+++
date = '2025-07-25T00:00:00-06:00'
title = 'Implemented Chaser Enemy'
draft = false
tags = ['Shape Wars']
showTableOfContents = false
showReadingTime = true
showAuthor = false
+++

Implemented a new enemy type that actively chases the player's position, with adjustable speed via the inspector. During development, we encountered errors in the object pooling system caused by using object names with FindGameObject, which led to issues from misspellings. Switching to Tags for object identification has resolved these errors and improved reliability.

## Images

![entry8](entry8.gif)
