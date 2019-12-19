# github-release-downloads
Get the number of downloads of release artifacts for a GitHub repo

# Install
`npm install -g github-release-downloads`

# Usage
```
github-release-downloads
Get the number of downloads of releases of a GitHub repo
Usage: /usr/local/bin/github-release-downloads <org>[/]<repo>

Options:
  --username, -u                      Username to authenticate as [default: from $GITHUB_USERNAME or none]
  --token, -t                         Personal access token to authenticate with [default: from $GITHUB_TOKEN or none]
  --prerelease, --all, --prereleases  Include prereleases
  --minor                             Combine equivalent minor versions, e.g. 1.0.0 and 1.0.1 into 1.0.x
  --patch                             Combine equivalent patch versions, e.g. 1.0.0-rc1 and 1.0.0 into 1.0.0
  --match                      Which kinds of files to match [sha, binary, all]                        [default: "binary"]
  --csv                               Output comma-separated-values
``` 
