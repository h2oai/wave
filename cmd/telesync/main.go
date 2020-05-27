package main

import (
	"flag"

	"github.com/h2oai/telesync"
)

func main() {
	// TODO https://github.com/urfave/cli/blob/master/docs/v2/manual.md

	var conf telesync.ServerConf

	flag.StringVar(&conf.Listen, "listen", ":55555", "listen on this address")
	flag.StringVar(&conf.WebRoot, "webroot", "./ui/build", "directory to serve web assets from")
	flag.StringVar(&conf.AccessKeyID, "access-key-id", "access_key_id", "default access key ID")
	flag.StringVar(&conf.AccessKeySecret, "access-key-secret", "access_key_secret", "default access key secret")
	flag.StringVar(&conf.Init, "init", "", "initialize site content from AOF log")
	flag.StringVar(&conf.Compact, "compact", "", "compact AOF log")

	flag.Parse()

	telesync.Run(conf)
}
