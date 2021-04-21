To start the Wave server, simply open a new terminal window and execute `waved` (or `waved.exe` on Windows).

```shell
cd $HOME/wave
./waved
```

```
2020/10/27 16:16:34 # 
2020/10/27 16:16:34 # ┌─────────────────────────┐
2020/10/27 16:16:34 # │  ┌    ┌ ┌──┐ ┌  ┌ ┌──┐  │ H2O Wave
2020/10/27 16:16:34 # │  │ ┌──┘ │──│ │  │ └┐    │ (version) (build)
2020/10/27 16:16:34 # │  └─┘    ┘  ┘ └──┘  └─┘  │ © 2020 H2O.ai, Inc.
2020/10/27 16:16:34 # └─────────────────────────┘
2020/10/27 16:16:34 # 
2020/10/27 16:16:34 # {"address":":10101","t":"listen","webroot":"/home/elp/wave/www"}
```

The Wave server should now be running at [http://localhost:10101](http://localhost:10101).

:::caution Don't close this terminal window!
To run any Wave app, you need the Wave server up and running at all times. Your web browser communicates with the Wave server, and the Wave server in turn communicates with the Wave app.
:::
