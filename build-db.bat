for /f %%i in ('date /t') do set @bdate=%%i
for /f %%i in ('time /t') do set @btime=%%i
go build -ldflags "-X main.Version=%VERSION% -X main.BuildDate=%@bdate%-%@btime%" -o wavedb.exe cmd\wavedb\main.go
7z a -tzip wavedb-%VERSION%-windows-amd64.zip wavedb.exe

