package main

import (
	"flag"
	"log"

	"github.com/h2oai/telesync"
)

func main() {
	// TODO https://github.com/urfave/cli/blob/master/docs/v2/manual.md
	var (
		port     string
		www      string
		username string
		password string
	)

	log.SetFlags(0)

	flag.StringVar(&port, "port", ":55555", "listen on this port")
	flag.StringVar(&www, "www", "./ui/build", "web root") // XXX rename
	flag.StringVar(&username, "username", "admin", "default client username")
	flag.StringVar(&password, "password", "admin", "default client password")

	flag.Parse()

	s := &telesync.Server{}
	s.Run(port, www, username, password)
}
