REM Prepare WebSites file
@PAUSE
	
@echo off 
set "rentIISDir=%~dp0"
set "rentDir=%rentIISDir:~0,-4%"

setlocal enableextensions disabledelayedexpansion

set "search=$$42rent$$"
set "replace=%rentDir%"

set "inTextFile=%~dp042WebSites.xml"
set "outTextFile=%~dp042WebSites.local.xml"

for /f "delims=" %%i in ('type "%inTextFile%" ^& break ^> "%outTextFile%" ') do (
		set "line=%%i"
		setlocal enabledelayedexpansion
		>>"%outTextFile%" echo(!line:%search%=%replace%!
		endlocal
)
@echo on

REM Import 42AppPools
@PAUSE
%windir%\system32\inetsrv\appcmd add apppool /in < %~dp042AppPools.xml

REM Import 42WebSites
@PAUSE
%windir%\system32\inetsrv\appcmd add site /in < %~dp042WebSites.local.xml

REM Declare 42 bindings in hosts file
@PAUSE
SET NEWLINE=^& echo.
FIND /C /I "board-api.42rent.com" %WINDIR%\system32\drivers\etc\hosts
IF %ERRORLEVEL% NEQ 0 ECHO %NEWLINE%^127.0.0.1 board-api.42rent.com>>%WINDIR%\System32\drivers\etc\hosts
FIND /C /I "www.42rent.com" %WINDIR%\system32\drivers\etc\hosts
IF %ERRORLEVEL% NEQ 0 ECHO %NEWLINE%^127.0.0.1 www.42rent.com>>%WINDIR%\System32\drivers\etc\hosts
@PAUSE
