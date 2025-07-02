@echo off
echo ========================================
echo BookCart Frontend Setup Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Installing Angular Material and additional packages...
call npm install @angular/material @angular/cdk @angular/animations @auth0/angular-jwt --force

echo.
echo Step 3: Installing Angular CLI globally (if not installed)...
call npm install -g @angular/cli

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo ng serve
echo.
echo Then open your browser to: http://localhost:4200
echo.
pause
