[![Build Status](https://travis-ci.org/hekar/gitfox.svg?branch=master)](https://travis-ci.org/hekar/gitfox)

# gitfox

Write your bookmarks from Firefox to a Git repository

## Usage

```
npm install -g gitfox
```

```

        _)   |      _|                 
  _` |   |   __|   |      _ \   \ \  /
 (   |   |   |     __|   (   |   `  <  
\__, |  _|  \__|  _|    \___/    _/\_\
|___/                                  

Usage: gitfox [command] [options]

Commands:
  commit                 commit, but do not push
  push [repository]      push to repository
  pull [repository]      [EXPERIMENTAL] use at own risk. Pull from repository into Firefox
  profiles               Read profile.ini and list available profiles
  export [exportFolder]  copy places.sqlite to exportFolder

Options:
  -v, --verbose                                                                              [count]
  --root          Configuration folder for gitfox                   [default: "~/.gitfox"]
  --firefox-home  Home directory for Firefox               [default: "~/.mozilla/firefox"]
  --profile-ini   Name of profiles.ini file                                [default: "profiles.ini"]
  --profile       Name of profile (ie. Profile0, Profile1, etc)                [default: "Profile0"]
  -h, --help      Show help                                                                [boolean]

More details: https://github.com/hekar/gitfox



```

## License
[MIT](./LICENSE)
