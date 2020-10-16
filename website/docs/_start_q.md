To start the Wave server, simply open a new terminal window and execute `wave` (or `wave.exe` on Windows).

```shell
cd $HOME/wave
./wave
```

```
2020/10/15 12:04:40 #
2020/10/15 12:04:40 # ┌───────────────────┐
2020/10/15 12:04:40 # │   ┬ ┬┌─┐┬  ┬┌─┐   │
2020/10/15 12:04:40 # │   │││├─┤└┐┌┘├┤    │
2020/10/15 12:04:40 # │   └┴┘┴ ┴ └┘ └─┘   │
2020/10/15 12:04:40 # └───────────────────┘
2020/10/15 12:04:40 #
2020/10/15 12:04:40 # {"address":":55555","t":"listen","webroot":"/home/elp/wave/www"}
```

The Wave server should now be running at [http://localhost:55555](http://localhost:55555).

:::caution Don't close this terminal window!
To run any Wave app, you need the Wave server up and running at all times. Your web browser communicates with the Wave server, and the Wave server in turn communicates with the Wave app.
:::
