'use strict';

const fs = require('fs')
const path = require('path')

const pull = require('pull-stream')
const paramap = require('pull-paramap')
const file = require('pull-file')
const map = require('pull-stream/throughs/map')
const filter = require('pull-stream/throughs/filter')
const split = require('pull-split')
const collect = require('pull-stream/sinks/collect')
const catchError = require('pull-catch')
const stdio = require('pull-stdio')

function parseFileList(dir){
    return pull(
        split(),    
        filter(x=>x.length),
        map(fn=>path.join(dir, fn))
    )
}

const handleError = ({stderr, exit}) => (err) => {
    stderr.write(String(err) + '\n')
    exit(1)
}

function main() {
    const dir = process.argv[2]
    pull(
        file(path.join(dir, 'index.txt')),
        parseFileList(dir),
        paramap(fs.readFile),
        catchError(handleError(process)),
        stdio.stdout()
    )
}
if (process.mainModule.filename === __filename) main()
