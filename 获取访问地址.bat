@echo off
title 获取局域网访问地址
color 0E

echo.
echo ========================================
echo   获取局域网访问地址
echo ========================================
echo.

:: 获取本机IP
for /f "tokens=16" %%i in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do set LOCAL_IP=%%i

:: 显示访问地址
echo 🌐 访问地址:
echo.
echo   本机访问:
echo   http://localhost:8081/test.html
echo.
echo   局域网访问（让同事使用这个）:
echo   http://%LOCAL_IP%:8081/test.html
echo.

:: 生成二维码
echo 是否生成二维码？(需要联网)
set /p choice="输入Y生成二维码，或直接按回车跳过: "
if /i "%choice%"=="Y" (
    echo.
    echo 请访问以下网站生成二维码:
    echo https://cli.im/url
echo.
    echo 输入地址: http://%LOCAL_IP%:8081/test.html
necho.
) else (
    echo.
    echo 💡 直接将下面的地址分享给同事:
echo   http://%LOCAL_IP%:8081/test.html
necho.
)

pause
