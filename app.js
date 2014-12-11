var fs = require('fs'),
util = require('util'),
//要监控的文件路径
path = '/Users/kamisama/vimfiles';
var PathWatcher = require('pathwatcher');
var watcher1 = null;
var DirArray = [];
var temp = [];
var FileArray = [];
var initArray = [];
var tempTime = 0;


function DateToMilliseconds(date) {
    var a=date.split(":");
    return times = a[0]*60*60*1000+a[1]*60*1000+a[2]*1000;
}

function init() {
    console.log(">>>:Start watch the Folder:"+path+"    ....");
    watcher(path);
    DirArray = scanFolder(path);
    for (var i=0;i<DirArray.length;i++) {
        watcher(DirArray[i]);
    }

}


function watcher(pathorfile) {
    watcher1 = PathWatcher.watch(pathorfile, function(event) {
        temp = DirArray;
        DirArray = scanFolder(path);
        initArray = scanFolder(path);
        var type =0;
        if (temp.length == DirArray.length ) {
            type =1;
        }else if(temp.length < DirArray.length) {
            type =2;
        }else if (temp.length > DirArray.length) {
            type =3;
        }

        if (type ==1 ||type ==2) {
            for (var i=0;i<DirArray.length;i++) {
                for (var j=0;j<temp.length;j++) {
                    if (DirArray[i] == temp[j]){
                        delete initArray[i];
                    }
                }
            }
        }

        if(type == 3) {
            initArray = temp;
            for (var i=0;i<temp.length;i++) {
                for (var j=0;j<DirArray.length;j++) {
                    if (temp[i] == DirArray[j]){
                        delete initArray[i];
                    }
                }
            }
        }


        var addFile="";
        for (var i= 0;i<initArray.length;i++) {
            if (initArray[i]!=""&&initArray[i]!=undefined){
                addFile =initArray[i];
            }
        }
        watcher(addFile);
        if (addFile!="" && addFile != undefined){
            switch(type){
                case 1:
                    console.log("rename");
                    console.log(addFile);
                break;
                case 2:
                    console.log("Add Folder");
                    console.log(addFile);
                break;
                case 3:
                    console.log("delete Folder");
                    console.log(addFile);
                break;
            }
        }
        /*
        if (event == "rename" && this.path.indexOf("/.Trash/")<=-1) {
            console.log("rename");
            console.log(this.path);
        }
        */
        //console.log(this.path+",event:"+event);
        /*
        console.log("temp:"
        );
        console.log(temp);
        console.log("dir:");
        console.log(initArray);
        console.log(this.path+",event："+event);*/
        //PathWatcher2.close();
    });
}

function scanFolder(path){
    var fileList = [],
    folderList = [],
    walk = function(path, fileList, folderList) {
        files = fs.readdirSync(path);
        files.forEach(function(item) {
            var tmpPath = path + '/' + item,
            stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                walk(tmpPath, fileList, folderList);
                if (path != tmpPath) {
                    folderList.push(tmpPath);
                }
            }
        });
    };
    walk(path, fileList, folderList);
    return folderList;
}

init();
