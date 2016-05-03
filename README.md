# firegit

Write your bookmarks from Firefox to a Git repository

## Usage

```
___                                          __      
/'___\  __                              __    /\ \__   
/\ \__/ /\_\    _ __     __      __     /\_\   \ \ ,_\  
\ \ ,__\\/\ \  /\`'__\ /'__`\  /'_ `\   \/\ \   \ \ \/  
\ \ \_/ \ \ \ \ \ \/ /\  __/ /\ \L\ \   \ \ \   \ \ \_
\ \_\   \ \_\ \ \_\ \ \____\\ \____ \   \ \_\   \ \__\
\/_/    \/_/  \/_/  \/____/ \/___L\ \   \/_/    \/__/
                              /\____/                
                              \_/__/                 

Usage: lib/index.js -r <repo> [options]

Options:
-v, --verbose                                                          [count]
-r, --git-repository  Repository to upload to                       [required]
--firefox-home        Home directory for Firefox
                                    [default: "~/.mozilla/firefox"]
--profile-ini         Name of profiles.ini file      [default: "profiles.ini"]
--profile             Name of profile (ie. Profile0, Profile1, etc)
                                                        [default: "Profile0"]

More details: https://github.com/hekar/firegit

```

## License
[MIT](./LICENSE)
