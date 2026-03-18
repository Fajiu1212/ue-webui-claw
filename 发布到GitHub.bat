@echo off
title 发布到GitHub
color 0A

echo.
echo ========================================
echo   发布到GitHub
echo ========================================
echo.

:: 切换到项目目录
cd /d g:\Claw_Project\Claw_WebUI

echo 步骤1: 检查Git状态
echo ========================
git status
echo.

echo.
echo 步骤2: 添加所有文件
echo ========================
git add .
git status
echo.

echo.
echo 步骤3: 提交文件
echo ========================
git commit -m "Initial commit: UE5.5 WebUI智慧梁场管控平台前端项目"
echo.

echo.
echo 步骤4: 推送到GitHub
echo ========================
echo 请输入GitHub仓库地址（例如: https://github.com/yourname/repo.git）
set /p repo="GitHub仓库地址: "

echo.
echo 正在推送...
git remote add origin %repo%
git push -u origin master

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ 发布成功！
    echo ========================================
    echo.
    echo 您的项目已发布到GitHub:
    echo %repo%
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ 发布失败，请检查错误信息
    echo ========================================
    echo.
)

echo.
echo 按任意键退出...
pause >nul
