#!/usr/bin/env node

const Sort = require('./sort');

const request = require('request');
const parser = require('optimist')
  .usage('Get the number of downloads of releases of a GitHub repo\nUsage: $0 <org>[/]<repo>')
  .options('username', {
    describe: 'Username to authenticate as',
    alias: 'u',
    default: process.env.GITHUB_USERNAME,
  })
  .options('token', {
    describe: 'Personal access token to authenticate with',
    alias: 't',
    default: process.env.GITHUB_TOKEN,
  })
  .options('prerelease', {
    boolean: true,
    alias: ['prereleases'],
    describe: 'Include prereleases',
  })
  .options('minor', {
    boolean: true,
    describe: 'Combine equivalent minor versions, e.g. 1.0.0 and 1.0.1 into 1.0.x'
  })
  .options('patch', {
    boolean: true,
    describe: 'Combine equivalent patch versions, e.g. 1.0.0-rc1 and 1.0.0 into 1.0.0'
  })
  .options('match', {
    describe: 'Which kinds of files to match [sha, binary, all]',
    default: 'binary',
  })
  .options('csv', {
    describe: 'Output comma-separated-values'
  });

const args = parser.argv;

let org = args._[0];
let repo = args._[1];

if ( org && !repo && org.includes('/') ) {
  const parts = org.split('/', 2);
  org = parts[0];
  repo = parts[1];
}

if ( !org || !repo ) {
  parser.showHelp();
  process.exit(1);
}

const data = {};
const filenames = {};

loop(null, function() {
  Sort(Object.keys(data)).forEach((key) => {
    const obj = data[key];

    if ( args.csv ) {
      console.log(`"${obj.tag}",${obj.downloads},${obj.date.replace('Z','').replace('T',' ')}`);
    } else {
      console.log(obj.tag + ": " + obj.downloads + " (" + obj.date + ")");
    }
  });

  console.error('Unique filenames matched: ', Object.keys(filenames).join(', '));
});

function loop(url, cb) {
  if ( !url ) {
    url = `https://api.github.com/repos/${ org }/${ repo }/releases`;
  }

  req('GET', url, function(err, response, body) {
    if ( err || response.statusCode !== 200 )
    {
      console.error("Error: ", err, response.statusCode, body);
      process.exit(1);
    }

    var json = JSON.parse(body);

    for ( const row of json ) {
      let tag = row.tag_name;
      const date = row.created_at;
      let downloads = 0;

      if ( !args.prerelease ) {
        if ( row.prerelease || tag.includes('-') ) {
          continue;
        }
      }

      if ( args.patch || args.minor ) {
        tag = tag.replace(/-.*$/, '');
      }

      if ( args.minor ) {
        tag = tag.replace(/([^.]+\.[^.]+)\..*$/, '$1');
      }

      let entry = data[tag];
      if ( entry ) {
        // Use the oldest date for the minor version
        if ( entry.date > date ) {
          entry.date = date;
        }
      } else {
        entry = { tag, date, downloads: 0 };
        data[tag] = entry;
      }

      const match = args.match.toLowerCase();

      for ( const asset of row.assets ) {
        if ( args.match === 'all' ||
            (args.match === 'binary' && asset.content_type === 'application/octet-stream') ||
            (args.match === 'sha' && asset.name.match(/sha\d+sum/) )
        ) {
          filenames[asset.name] = (filenames[asset.name] || 0) + 1;
          entry.downloads += asset.download_count || 0;
        }
      }
    }

    const links = parseLinkHeader(response.headers.link);
    if ( links.next ) {
      loop(links.next, cb);
    } else {
      cb();
    }
  });
}

function req(method, url, cb) {
  // console.error('Request', method, url);
  var opt = {
    method: method,
    url: url,
    headers: {
      'user-agent': 'node',
    }
  };

  if ( args.username && args.token ) {
    opt.headers['authorization'] = 'Basic ' + Buffer.from(`${args.username}:${args.token}`).toString('base64');
  }

  request(opt, cb);
}


function parseLinkHeader(str) {
  const out = {};
  const lines = (str || '').split(',');

  for ( const line of lines ) {
    const match = line.match(/^\s*<([^>]+)>\s*;\s*rel\s*="(.*)"/);

    if ( match ) {
      out[match[2].toLowerCase()] = match[1];
    }
  }

  return out;
}
