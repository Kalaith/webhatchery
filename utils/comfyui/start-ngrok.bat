@echo off
REM Start ngrok tunnel for ComfyUI with fixed URL
REM This uses a specific ngrok URL that won't change

echo Starting ngrok tunnel for ComfyUI...
echo URL: awaited-grouper-talented.ngrok-free.app
echo Local server: localhost:8188
echo.
echo Press Ctrl+C to stop the tunnel
echo.

ngrok http --url=awaited-grouper-talented.ngrok-free.app localhost:8188

pause