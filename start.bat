@echo off
echo 正在启动UE5.5 WebUI预览服务器...
cd /d g:\Claw_Project\Claw_WebUI
echo.
echo 服务器信息:
echo =============
echo 服务目录: g:\Claw_Project\Claw_WebUI\src\pages
echo 访问地址: http://localhost:8080
echo 测试页面: http://localhost:8080/test.html
echo.
echo 按 Ctrl+C 停止服务器
echo.
node start-server.js

