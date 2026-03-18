@echo off
title 手动提交到Git
color 0A

echo.
echo ========================================
echo   手动提交到Git
echo ========================================
echo.

cd /d g:\Claw_Project\Claw_WebUI

echo 正在提交...
echo.

:: 配置用户信息（如果还没有配置）
git config user.name "你的GitHub用户名"
git config user.email "你的GitHub邮箱@example.com"

:: 提交所有文件
git commit -m "Initial commit: UE5.5 WebUI智慧梁场管控平台前端项目

- 科技风格导航栏（6个按钮+中间标题）
- 与UE5.5双向通信功能
- 完整的日志和状态监控
- 支持局域网和本机访问
- 包含完整的文档和部署指南"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ 提交成功！
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   ❌ 提交失败，请检查错误信息
    echo ========================================
)

echo.
echo 按任意键退出...
pause >nul
