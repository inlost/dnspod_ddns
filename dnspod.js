#!/usr/bin/env node

'use strict';

const spawn = require('child_process').spawn;
const os = require('os');
const args = process.argv;

const API_TYPE = {
    D_LIST: 'D_LIST',
    R_LIST: 'R_LIST',
    R_DDNS: 'R_DDNS'
};
const API_URI = {
    D_LIST: 'https://dnsapi.cn/Domain.List',
    R_LIST: 'https://dnsapi.cn/Record.List',
    R_DDNS: 'https://dnsapi.cn/Record.Ddns'
};
let shellArgs = [
    '-A', 'inlost DDNS Client/1.0.0 (sailflyer@gmail.com)',
    '-X', 'POST'
];
let pars = new Map();

let token = '';
let domain = '';
let domainId = '';
let subDomain = '';
let recordId = '';
let recordLine = '默认';
let ip = '';

if(args.length < 4){
    return console.log('need args');
}

token = args[2];
subDomain = args[3].split('.')[0];
domain = args[3].replace(`${subDomain}.`, '');
ip = args[4] || null;

pars.set('login_token', token);
pars.set('format', 'json');

function getPars(type){
    let _pars = new Map(pars);
    let arrPars = [];

    if(type === API_TYPE.R_LIST){
        _pars.set('domain_id', domainId);
    }
    if(type === API_TYPE.R_DDNS){
        _pars.set('domain_id', domainId);
        _pars.set('record_id', recordId);
        _pars.set('record_line', recordLine);
        _pars.set('sub_domain', subDomain);
        ip && _pars.set('value', ip);
    }

    for(var [key, value] of _pars.entries()){
        arrPars.push(`${key}=${value}`);
    }
    return arrPars.join('&');
};

function fetchApi(type){
    let strPars = getPars(type);

    const sh = spawn('curl', shellArgs.concat([API_URI[type], '-d', strPars]), {});

    return new Promise((resolve, reject) => {
        sh.stdout.on('data', (data) => {
            data = JSON.parse(data.toString());

            data.status.code === '1' ?
                resolve(data) :
                reject(data.status);
        });

    });
};

fetchApi(API_TYPE.D_LIST).then((rst) => {
    rst.domains.forEach((dm) => {
        if(dm.name === domain){
            domainId = dm.id;
        }
    });
}).then(() => {
    return fetchApi(API_TYPE.R_LIST).then((rst) => {
        rst.records.forEach((rec) => {
            if(rec.name === subDomain){
                recordId = rec.id;
            }
        });
    });
}).then(() => {
    fetchApi(API_TYPE.R_DDNS).then((rst) => {
        console.log(rst.status.message);
    });
});
