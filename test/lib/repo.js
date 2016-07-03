import path from 'path'

import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import xattr from 'fs-xattr'
import { expect } from 'chai'
import validator from 'validator'
import UUID from 'node-uuid'

import { testing as xstatTesting } from '../../src/lib/xstat'
import { rimrafAsync, mkdirpAsync, fsReaddirAsync, fsStatAsync } from '../../src/lib/tools'
import { buildTreeAsync } from '../../src/lib/buildTree'
import { createRepo } from '../../src/lib/repo'

const { xattrGetRaw } = xstatTesting

describe('repo', function() {

  describe('create repo', function() {

    let rootpath = path.join(process.cwd(), 'tmptest') 
    it('should create a new repo for given folder', function(done) {
      
      rimraf('tmptest', err => {
        if (err) return done(err)
        mkdirp('tmptest', err => {
          if (err) return done(err)
          
          let repo = createRepo(rootpath)
          expect(repo.rootpath).to.equal(rootpath)
          expect(repo.drives).to.deep.equal([])
          expect(repo.libraries).to.deep.equal([])
          done()
        })
      }) 
    })
  })

  describe('repo scan', function() {

    let rootpath = path.join(process.cwd(), 'tmptest')
    it('should scan uuid folders in drive and library folder', function(done) {

      let userUUID = UUID.v4()
      let dpath = path.join(rootpath, 'drive', userUUID)
      let preset = {
        uuid: UUID.v4(),
        owner: [userUUID],
        writelist: [],
        readlist: [],
        hash: null,
        htime: -1
      }

      rimraf('tmptest', err => {
        if (err) return done(err)
        mkdirp(dpath, err => {
          if (err) return done(err)
          xattr.set(dpath, 'user.fruitmix', JSON.stringify(preset), err => {
            if (err) return done(err)

            let repo = createRepo(rootpath)
            repo.scan()
            
            expect(repo.rootpath).to.equal(rootpath)
            expect(repo.drives.length).to.equal(1)
            done()
          })
        })
      })
    }) 
  })
   /** 
    it('should create new folder, with proper xattr, as well as tree node,  if not existing', function(done) {  

      rimraf('tmptest', err => {
        if (err) wrn done(err)
        mkdirp('tmptest', err => {
          if (err) return done(err)

          
        })
      })  


      repo.createDrive(userUUID1, (err, newNode) => {
        if (err) return done(err) 

        let dirpath = path.join(root, 'drive', userUUID1)
        xattrGetRaw(dirpath, 'user.fruitmix', (err, xattr) => { 
          if (err) return done(err)

          let folderUUID = xattr.uuid
          expect(validator.isUUID(folderUUID)).to.be.true

          expect(xattr.owner).to.deep.equal([userUUID1])
          expect(xattr.writelist).to.deep.equal([])
          expect(xattr.readlist).to.deep.equal([])

          expect(xattr.hash).to.be.null
          expect(xattr.htime).to.equal(-1)

          expect(newNode.parent).to.equal(repo.driveDirNode)
          expect(newNode.uuid).to.equal(folderUUID)
          expect(newNode.type).to.equal('folder')
          expect(newNode.permission.owner).to.equal(xattr.owner[0]) // TODO
          expect(newNode.attribute.name).to.equal(userUUID1)
          done()
        })
      })
    })

    it('shold NOT create new folder if already existing', function(done) {
      repo.createDrive(userUUID2, (err, result) => {
        expect(err).to.be.an('error')
        expect(err.code).to.equal('EEXIST')
        done()
      })
    })
  })

  /** create library **/
  /**
  describe('create library', function() {

    let root = path.join(process.cwd(), 'tmptest') 
    let userUUID1 = UUID.v4()
    let userUUID2 = UUID.v4()
    let libraryUUID1 = UUID.v4()
    let repo

    async function setup(root) {

      let r
      r = await rimrafAsync('tmptest')
      if (r instanceof Error) return r
      
      r = await mkdirpAsync('tmptest')
      if (r instanceof Error) return r

      r = await mkdirpAsync(`tmptest/library/${userUUID2}`)
      if (r instanceof Error) return r

      return await buildTreeAsync(path.join(root))
    }

    before(function(done) {
      setup(root)
        .then(tree => {
          if (tree instanceof Error) return done(r)
          repo = new Repo(root, tree)
          done()
        }) 
        .catch(e => done(e))
    })   
 
    it('should create new library, with proper xattr, as well as tree node,  if not existing', function(done) {  
      repo.createLibrary(userUUID1, libraryUUID1, (err, newNode) => {
        if (err) return done(err) 

        let dirpath = path.join(root, 'library', libraryUUID1)
        xattrGetRaw(dirpath, 'user.fruitmix', (err, xattr) => { 
          if (err) return done(err)

          let folderUUID = xattr.uuid
          expect(validator.isUUID(folderUUID)).to.be.true

          expect(xattr.owner).to.deep.equal([userUUID1])
          expect(xattr.writelist).to.deep.equal([])
          expect(xattr.readlist).to.deep.equal([])

          expect(xattr.hash).to.be.null
          expect(xattr.htime).to.equal(-1)

          expect(newNode.parent).to.equal(repo.driveDirNode)
          expect(newNode.uuid).to.equal(folderUUID)
          expect(newNode.type).to.equal('folder')
          expect(newNode.permission.owner).to.equal(xattr.owner[0]) // TODO
          expect(newNode.attribute.name).to.equal(userUUID1)
          done()
        })
      })
    })

    it('shold NOT create new folder if already existing', function(done) {
      repo.createDrive(userUUID2, (err, result) => {
        expect(err).to.be.an('error')
        expect(err.code).to.equal('EEXIST')
        done()
      })
    })
  })
  **/ // end of test library
})
