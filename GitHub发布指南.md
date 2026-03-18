# GitHub发布指南

## 方法1：使用GitHub Desktop（推荐新手）

### 步骤1：下载GitHub Desktop
1. 访问 https://desktop.github.com/
2. 下载并安装GitHub Desktop

### 步骤2：登录GitHub账号
1. 打开GitHub Desktop
2. 点击 "Sign in to GitHub.com"
3. 输入GitHub用户名和密码

### 步骤3：创建新仓库
1. 点击 "File" → "Add Local Repository"
2. 选择本地路径：`g:\Claw_Project\Claw_WebUI`
3. 点击 "Add Repository"

### 步骤4：发布到GitHub
1. 在GitHub Desktop中，点击 "Publish repository"
2. 填写仓库名称（如：ue-webui-claw）
3. 添加描述
4. 选择公开（Public）或私有（Private）
5. 点击 "Publish repository"

---

## 方法2：使用命令行

### 步骤1：创建GitHub仓库

1. 访问 https://github.com
2. 点击右上角的 "+" → "New repository"
3. 填写信息：
   - Repository name: ue-webui-claw
   - Description: UE5.5 WebUI智慧梁场管控平台前端项目
   - Public/Private: 选择Public
4. 点击 "Create repository"

### 步骤2：初始化本地仓库

打开命令提示符（CMD）或PowerShell：

```bash
cd g:\Claw_Project\Claw_WebUI

# 初始化Git（已执行）
git init

# 配置用户信息（如果还没配置）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"

# 添加所有文件（已执行）
git add .

# 提交文件
git commit -m "Initial commit: UE5.5 WebUI智慧梁场管控平台前端项目"
```

### 步骤3：推送到GitHub

在GitHub创建仓库后，会显示仓库地址，例如：
```
https://github.com/your-username/ue-webui-claw.git
```

执行以下命令：

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/ue-webui-claw.git

# 推送代码
git push -u origin master
```

如果是第一次推送，会提示输入GitHub用户名和密码（或token）。

---

## 方法3：使用VS Code

### 步骤1：安装VS Code
1. 访问 https://code.visualstudio.com/
2. 下载并安装

### 步骤2：打开项目
1. 在VS Code中，点击 "File" → "Open Folder"
2. 选择 `g:\Claw_Project\Claw_WebUI`

### 步骤3：初始化Git
1. 点击左侧的源代码管理图标（或按 Ctrl+Shift+G）
2. 点击 "Initialize Repository"

### 步骤4：提交代码
1. 在消息框输入：Initial commit
2. 点击 "Commit"

### 步骤5：发布到GitHub
1. 点击左下角的账户图标
2. 登录GitHub
3. 点击 "Publish to GitHub"
4. 填写仓库名称和描述
5. 点击 "Publish"

---

## 常见问题

### Q: 提示需要用户名和密码？
**A**: GitHub已停用密码验证，需要使用Token：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 选择 "repo" 权限
4. 复制Token
5. 密码处输入Token

### Q: 推送被拒绝？
**A**: 可能是远程仓库已存在文件，执行：
```bash
git pull origin master --allow-unrelated-histories
git push -u origin master
```

### Q: 如何更新代码？
**A**:
```bash
# 添加修改
git add .

# 提交
git commit -m "更新描述"

# 推送
git push
```

### Q: 如何克隆到其他地方？
**A**:
```bash
git clone https://github.com/your-username/ue-webui-claw.git
```

---

## 发布后的操作

### 查看项目
访问：https://github.com/your-username/ue-webui-claw

### 分享项目
复制GitHub仓库地址分享给同事：
```
https://github.com/your-username/ue-webui-claw
```

### 添加协作者
1. 进入GitHub仓库
2. 点击 "Settings" → "Manage access"
3. 点击 "Invite a collaborator"
4. 输入同事的GitHub用户名

### 创建README
项目已包含README.md文件，GitHub会自动显示。

---

## 推荐的GitHub仓库设置

### 添加描述
在GitHub仓库页面，点击右上角的 "About" → "Edit"

### 添加标签
添加标签：
- ue5
- webui
- unreal-engine
- javascript
- frontend

### 启用Issues
用于 bug报告和功能建议

### 启用Projects
用于项目管理

---

## 快速命令参考

```bash
# 查看状态
git status

# 查看日志
git log

# 添加文件
git add .

# 提交
git commit -m "描述信息"

# 推送
git push

# 拉取
git pull

# 查看分支
git branch

# 创建分支
git branch feature-name

# 切换分支
git checkout feature-name

# 合并分支
git merge feature-name
```

---

## 需要帮助？

- GitHub文档：https://docs.github.com/
- Git命令：https://git-scm.com/doc
- 提交Issue到本项目

---

**🎉 祝发布成功！**
