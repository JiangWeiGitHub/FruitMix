import path from 'path'
import fs from 'fs'

import Promise from 'bluebird'

import rimraf from 'rimraf'
import mkdirp from 'mkdirp'

export const rimrafAsync = Promise.promisify(rimraf)
export const mkdirpAsync = Promise.promisify(mkdirp)

Promise.promisifyAll(fs)

export { fs }

export const mapXstatToObject = (xstat) => {

/* example xstat, xstat instanceof fs.stat
{ dev: 2049,
  mode: 16893,
  nlink: 2,
  uid: 1000,
  gid: 1000,
  rdev: 0,
  blksize: 4096,
  ino: 135577,
  size: 4096,
  blocks: 16,
  atime: 2016-06-27T06:36:58.382Z,
  mtime: 2016-06-27T06:36:58.382Z,
  ctime: 2016-06-27T06:36:58.382Z,
  birthtime: 2016-06-27T06:36:58.382Z,
  uuid: '0924c387-f1c6-4a35-a5db-ae4b7568d5de',
  owner: [ '061a954c-c52a-4aa2-8702-7bc84c72ec84' ],
  writelist: [ '9e7b40bf-f931-4292-8870-9e62b9d5a12c' ],
  readlist: [ 'b7ed9abc-01d3-41f0-80eb-361498025e56' ],
  hash: null,
  abspath: '/home/xenial/Projects/fruitmix/tmptest' } */

  // not very safe TODO
  // let name = xstat.abspath.split('/').pop()
  let name = path.basename(xstat.abspath)
  
  let type
  if (xstat.isDirectory()) type = 'folder'
  else if (xstat.isFile()) type = 'file'
  else throw new Error('Only xstat with type of folder or file can be mapped')

  let obj = {
    uuid: xstat.uuid,
    type: type,
    owner: xstat.owner,
    writelist: xstat.writelist,
    readlist: xstat.readlist,
    name: name,
  }

  if (xstat.isFile() && xstat.hash) obj.hash = xstat.hash  
  if (obj.type === 'file') obj.size = xstat.size

  return obj
}


