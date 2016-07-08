# gitfox

Write your bookmarks from Firefox to a Git repository

## Usage

```

        _)   |      _|                 
  _` |   |   __|   |      _ \   \ \  /
 (   |   |   |     __|   (   |   `  <  
\__, |  _|  \__|  _|    \___/    _/\_\
|___/                                  

Usage: lib/index.js [command] [options]

Commands:
commit             commit, but do not push
push [repository]  push to repository
pull [repository]  pull from remote git repository
profiles           Read profile.ini and list available profiles

Options:
-v, --verbose
                                                           [count]
--firefox-home  Home directory for Firefox
                                   [default: "~/.mozilla/firefox"]
--profile-ini   Name of profiles.ini file
                                         [default: "profiles.ini"]
--profile       Name of profile (ie. Profile0, Profile1, etc)
                                             [default: "Profile0"]
-h, --help      Show help
                                                         [boolean]

More details: https://github.com/hekar/gitfox

```

## License
[MIT](./LICENSE)
