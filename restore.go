package wave

import (
	"bufio"
	"bytes"
	"log"
	"os"
	"time"
)

var (
	logSep = []byte(" ")
)

func initSite(site *Site, aofPath string) {
	file, err := os.Open(aofPath)
	if err != nil {
		log.Fatalln("#", "failed opening AOF file:", err)
	}
	defer file.Close()

	startTime := time.Now()
	line, used := 0, 0
	scanner := bufio.NewScanner(file)
	for scanner.Scan() { // FIXME not reliable if line length > 65536 chars
		line++
		data := scanner.Bytes()
		tokens := bytes.SplitN(data, logSep, 4) // "date time marker entry"
		if len(tokens) < 4 {
			log.Println("#", "warning: want (date, time, marker, entry); skipped line", line)
			continue
		}

		marker, entry := tokens[2], tokens[3]
		if len(marker) > 0 {
			mark := marker[0]
			if mark == '#' { // comment
				continue
			}
			tokens = bytes.SplitN(entry, logSep, 2) // "url data"
			if len(tokens) < 2 {
				log.Println("#", "warning: want (url, data); skipped line", line)
				continue
			}
			url, data := tokens[0], tokens[1]
			switch mark {
			case '*': // patch existing page
				site.patch(string(url), data)
				used++
			case '=': // compacted page; overwrite
				site.set(string(url), data)
				used++
			default:
				log.Println("#", "warning: bad marker", marker, "on line", line)
			}
		}
	}

	log.Printf("# init: %d lines read, %d lines used, %s\n", line, used, time.Since(startTime))

	if err := scanner.Err(); err != nil {
		log.Fatalln("#", "failed scanning AOF file:", err)
	}
}

func compactSite(aofPath string) {
	site := newSite()
	initSite(site, aofPath)
	for url, page := range site.pages {
		log.Println("=", url, string(page.marshal()))
	}
}
