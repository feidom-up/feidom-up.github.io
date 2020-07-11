---
title: git常用命令(个人总结)
date: 2020-07-04 21:04:13
tags: 
- git
categories: git
---
### git概念
* Workspace：工作区
* Index / Stage：暂存区
* Repository：本地仓库
* Remote：远程仓库

### 常用命令
* 克隆一个项目和它的整个代码历史
`$ git clone [url]`

* 查看本地仓库分支
`$ git branch`

* 查看所有本地分支和远程分支
`$ git branch -a`

* 查看所有所有远程分支
`$ git branch -r`

* 查看分支关联关系
`$ git branch -vv`
---
* 显示有变更的文件
`$ git status`

* 添加当前目录的所有文件到暂存区
`$ git add .`

* 提交暂存区到本地仓库
`$ git commit -m [提交信息]`

* 拉取远程仓库带代码到本地仓库并合并
`$ git pull [remote] [branch]`
`$ git pull`(分支有关联关系时)

* 上传本地指定分支到远程仓库
`$ git push [remote] [branch]`
`$ git push`(分支有关联关系时)
---
* 新建一个本地分支，并切换到该分支
`$ git checkout -b [branch] [remote]`(-b会建立本地分支和远程分支的关联关系)
---
* 创建一个新的空分支（内容来自互联网）
`$ git checkout --orphan [新的分支名]` (建一个没有父节点的分支，但是会复制当前分支的内容到新的分支上。)

&emsp; 这个命令创建了新的分支并切换到新的分支下，并且里边有上个分支的内容
&emsp; **注意** ：其实这个时候新的分支还不能说是一个分支，你查看分支的话，是没有这个分支的，你必须要提交一次，这个分支才算是真的创建出来了
&emsp; 因为这个分支没有父节点，所以没有任何的历史，只需要调用
&emsp; ` $ git rm -rf .`
&emsp; 删除所有的文件（只会删除加入版本管理的文件），然后你可以随便创建一个文件，提交之后，这个新的空分支就算是创建完成了。

* 推送本地分支到远程分支
`git push origin [本地分支]:[远程分支]`

* 新建本地分支与远程分支关联关系
`git branch --set-upstream-to [远程分支] [本地分支]`

