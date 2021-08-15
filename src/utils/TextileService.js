import {  Buckets } from '@textile/hub';
import config from '../config';
import { mergeUint8Arr} from '../utils/utils';

export default class TextileService {

    constructor(){
    }
    
    async init(){
        const buck = await Buckets.withKeyInfo(config.bucketAuth, {debug:true})
        await buck.withThread(config.threadID);
        this.buckets = buck;
        return buck;
    }

    async uploadToTextile(bufferData, name) {
        const raw = await this.buckets.pushPath(config.bucketKey, name, {
        path: name,
        content: bufferData
        });
        return raw;
    }

    //returns a list of files at that path
    async fetchPathFromTextile (fileName, asString=true) {
        const files = [];
        const repeater = await this.buckets.pullPath('bafzbeibbklbg5ab4j7kwzk3jvc7h5k644hkdc6f6f26o73qh4g7plqudsm',fileName);
        for await(let i of repeater) {
        if(i instanceof Uint8Array) {
            files.push(i);
            }
        }
        let result =  mergeUint8Arr(files);
        if(asString) {
        result = new TextDecoder().decode(result);
        }
        return result
    }

    async uploadJson(jsonDoc, docPath) {
        const jsonBuffer = Buffer.from(JSON.stringify(jsonDoc));
        const uploadedFile = await this.uploadToTextile(jsonBuffer, docPath);
        return uploadedFile;
      }

}