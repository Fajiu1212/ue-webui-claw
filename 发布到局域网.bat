@echo off
title UE5.5 WebUI LAN Server
color 0A

echo.
echo ========================================
echo   UE5.5 WebUI LAN Server Launcher
echo ========================================
echo.
echo Starting server, please wait...
echo.

cd /d g:\Claw_Project\Claw_WebUI

:: Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not detected
    echo.
    echo Please install Node.js:
    echo Visit: https://nodejs.org/
    echo Download and install LTS version
    echo.
    pause
    exit /b 1
)

echo Node.js is installed
echo.
echo Starting LAN server...
echo.

:: Check firewall
netsh advfirewall show allprofiles state | findstr "ON" >nul
if %errorlevel% equ 0 (
    echo WARNING: Windows Firewall is enabled
    echo    Please ensure port 8080 is open for LAN access
    echo    See: 局域网发布指南.md
    echo.
    echo    Press any key to continue starting server...
    pause >nul
)

:: Start server
echo.
echo ========================================
echo  After server starts, share the LAN address
 echo  with your colleagues
 echo ========================================
echo.
node start-server-lan.js

:: If server exits unexpectedly
echo.
echo.
echo Server stopped
pause


