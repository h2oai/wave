To start the Q server, simply open a new terminal window execute `qd`.

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

The Q server should now be running at [http://localhost:55555](http://localhost:55555).

:::caution Don't close this terminal window! 
To run any Q app, you need the Q server up and running at all times. Your web browser communicates with the Q server, and the Q server in turn communicates with the Q app.
:::

