const uuid = require('node-uuid');
const globby = require('globby');
var fs = require('fs');
var xattr = require('fs-xattr');
var socket = require('socket.io-client')('http://localhost:10086');
var dmap1 = new Map();
var helper = require('middleware/tools');


function mtojson(){
  this.uid='';
  this.readlist=[];
  this.writelist=[];
  this.owner=[];
  this.type='';
  this.createtime='';
  this.changetime='';
  this.modifytime='';
  this.accesstime='';
  this.size='';
  this.path='';
  this.parent='';
  this.hash = '';
}

// io.sockets.on('connection', function(socket1){
//   socket1.on('deletefolderorfile', function(msg){
//     socket.emit('deletefolderorfile',msg);
//   });

//   socket1.on('checkpath', function(msg){
//     commoncheck(msg);
//   });
// });

function commoncheck(f){
  helper.tattoo(f);
  var uid = xattr.getSync(f,'user.uuid').toString('utf-8');
  var readlist = xattr.getSync(f,'user.readlist').toString('utf-8').split(',');
  var writelist = xattr.getSync(f,'user.writelist').toString('utf-8').split(',');
  var owner = xattr.getSync(f,'user.owner').toString('utf-8').split(',');
  var type = xattr.getSync(f,'user.type').toString('utf-8');
  var createtime = fstat.birthtime;
  var changetime = fstat.ctime;
  var modifytime = fstat.mtime;
  var accesstime = fstat.atime;
  var size = fstat.size;
  var mtobj = new mtojson();
  mtobj.uid=uid;
  mtobj.readlist=readlist;
  mtobj.writelist=writelist;
  mtobj.owner=owner;
  mtobj.type=type;
  mtobj.createtime=createtime;
  mtobj.changetime=changetime;
  mtobj.modifytime=modifytime;
  mtobj.accesstime=accesstime;
  mtobj.size=size;
  mtobj.path=f;

  if(dmap1.has(f.substr(0,f.lastIndexOf('/')))){
    var parent = dmap1.get(f.substr(0,f.lastIndexOf('/')));
    mtobj.parent=parent;
  }

  if (fstat&&fstat.isDirectory()){ 
    socket.emit('addfoldernode',mtobj);
    dmap1.set(f,uid);
  }
  else{
    mtobj.hash=xattr.getSync(f,'user.hash').toString('utf-8');
    //console.log(xattr.getSync(f,'user.uuid').toString('utf-8'));
    socket.emit('addfilenode',mtobj);
  }

  if(dmap1.has(f.substr(0,f.lastIndexOf('/')))){
    socket.emit('addchild',mtobj);
  }
  else{
    socket.emit('setroot',mtobj);
  }
}

function cronjob(tpath){
  newlist = globby.sync([tpath]);
  newlist.forEach(function(f){
   commoncheck(f);
  });
  //console.log('done');
}


//cronjob('/mnt/**');

socket.on('connect', function () { console.log("socket connected"); });

exports.checkall = cronjob;

exports.docheck = commoncheck;