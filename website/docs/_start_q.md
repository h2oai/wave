To start the Wave server, simply open a new terminal window execute `qd`.

```shell 
cd $HOME/q
./qd
```

```
2020/10/01 01:27:35 # 
2020/10/01 01:27:35 #              __
2020/10/01 01:27:35 #   ____ _____/ /
2020/10/01 01:27:35 #  / __ `/ __  /
2020/10/01 01:27:35 # / /_/ / /_/ /
2020/10/01 01:27:35 # \__, /\__,_/
2020/10/01 01:27:35 #   /_/
2020/10/01 01:27:35 # 
2020/10/01 01:27:35 # {"address":":55555","t":"listen","webroot":"/home/elp/q/www"}

```

The Wave server should now be running at [http://localhost:55555](http://localhost:55555).

:::caution Don't close this terminal window! 
To run any Wave app, you need the Wave server up and running at all times. Your web browser communicates with the Wave server, and the Wave server in turn communicates with the Wave app.
:::

