---
title: Claude desktop 中 MCP error 的 issue 修复
date: 2025-08-15 07:44:16
tags:
---

问题： Claude desktop 中运行 MCP 不论哪个都失败。
失败日志
    ERROR: You must supply a command.

查看 https://github.com/modelcontextprotocol/servers/issues/64 之后，有一个回答解决了问题：


Can you please check all versions installed in your NVM? do you have versions less than v18? if yes, try to delete them and run again.
您能检查一下 NVM 中安装的所有版本吗？你们有低于 v18 的版本吗？如果是，请尝试删除它们并重新运行。
For some reasons Claude use the earliest version of node in NVM.
出于某些原因，Claude 在 NVM 中使用了最早版本的节点。


按照这个答复做了。运行成功