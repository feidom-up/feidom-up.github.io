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
* 查看git config配置
`git config --list`

* git config全局配置
```bash
git config --global user.name "feidom"
git config --global user.email "qiaoxiansen@hotmail.com"
```

* git config针对单个项目配置用户
```bash
# cd 项目目录,作用于当前项目下的.git目录下的config
git config user.name "feidom"
git config user.email "qiaoxiansen@hotmail.com"
```
---
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
* 查看不同
`$ git diff`

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
* 创建一个新的空分支（内容来自互联网）
`$ git checkout --orphan [新的分支名]` (建一个没有父节点的分支，但是会复制当前分支的内容到新的分支上。)

>&emsp; 这个命令创建了新的分支并切换到新的分支下，并且里边有上个分支的内容
&emsp; **注意** ：其实这个时候新的分支还不能说是一个分支，你查看分支的话，是没有这个分支的，你必须要提交一次，这个分支才算是真的创建出来了
&emsp; 因为这个分支没有父节点，所以没有任何的历史，只需要调用
&emsp; ` $ git rm -rf .`
&emsp; 删除所有的文件（只会删除加入版本管理的文件），然后你可以随便创建一个文件，提交之后，这个新的空分支就算是创建完成了。

* 新建一个本地分支，并切换到该分支
`$ git checkout -b [本地分支] [remote]`(-b会建立本地分支和远程分支的关联关系)
* 从某个提交记录(2b5c3292)拉一个新分支出来
`$ git checkout 2b5c3292 -b [branch]`
* 提交当前分支到远程仓库的对应的新分支
`$ git push -u origin [branch]`(-u会建立本地分支和远程分支的关联关系)
* 新建本地分支与远程分支关联关系
`git branch --set-upstream-to [远程分支] [本地分支]`
* 删除本地分支
切到其他分支，然后`git branch -d [本地分支]`

* 从远程获取其他用户push上来的新分支
`git fetch`
---
* 查看远程仓库信息
`git remote -v`

* 移除远程仓库
`git remote remove origin`

* 添加远程仓库
`git remote add origin [远程仓库地址]`
---
* vscode合并分支
在vscode界面，输入：`ctrl(win)/command(mac)+shift+p`,然后输入`git merge`，然后选一个要合并到当前分支的分支，回车确定即可。
![git merge](https://image-static.segmentfault.com/800/712/800712115-59e96580eae4c_articlex)
![选择分支](https://image-static.segmentfault.com/236/385/2363856556-59e965b2e3674_articlex)
    

### git问题解决：
* git clone 时出错： 
```
    error: RPC failed; result=35, HTTP code = 0
    fatal: The remote end hung up unexpectedly
```
解决：
    * 查看全局的postBuffer配置 `git config http.postBuffer`
    * 把这个配置改大一点： `git config http.postBuffer 24288000`
    