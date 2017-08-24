REM Prepare WebSites file
	
@echo off 
setlocal enableextensions disabledelayedexpansion

set "search=$$42rent$$"
set "replace=%~dp0.."

set "textFile=%~dp042WebSites.xml"

for /f "delims=" %%i in ('type "%textFile%" ^& break ^> "%textFile%" ') do (
		set "line=%%i"
		setlocal enabledelayedexpansion
		>>"%textFile%" echo(!line:%search%=%replace%!
		endlocal
)
@echo on

REM Import 42AppPools
@PAUSE
%windir%\system32\inetsrv\appcmd add apppool /in < %~dp042AppPools.xml

REM Import 42WebSites
@PAUSE
%windir%\system32\inetsrv\appcmd add site /in < %~dp042WebSites.xml

REM Declare 42 bindings in hosts file
@PAUSE
SET NEWLINE=^& echo.
FIND /C /I "board-api.42rent.com" %WINDIR%\system32\drivers\etc\hosts
IF %ERRORLEVEL% NEQ 0 ECHO %NEWLINE%^127.0.0.1 board-api.42rent.com>>%WINDIR%\System32\drivers\etc\hosts
FIND /C /I "www.42rent.com" %WINDIR%\system32\drivers\etc\hosts
IF %ERRORLEVEL% NEQ 0 ECHO %NEWLINE%^127.0.0.1 www.42rent.com>>%WINDIR%\System32\drivers\etc\hosts
@PAUSE
