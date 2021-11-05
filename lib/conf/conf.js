'use strict';

/**
 * Conf - A encapsulated configuration class is used to better manage configuration related
 *
 * ####Example:
 *
 *     const conf = new Conf(conf);
 *     const val = conf.getVal(key);
 *     conf.setVal(key, val);
 *
 * @object
 */
const path = require('path');
const tempy = require('tempy');
const Utils = require('../utils/utils');

class Conf {
  constructor(conf = {}) {
    this.conf = conf;

    this.conf.pathId = Utils.uid();
    this.copyByDefaultVal(conf, 'crf', 20);
    this.copyByDefaultVal(conf, 'vb', null);
    this.copyByDefaultVal(conf, 'queue', 2);
    this.copyByDefaultVal(conf, 'ext', 'mp4');
    const ext = this.getVal('ext');
    this.copyByDefaultVal(conf, 'threads', 1);
    /**
     * -preset：指定输出的视频质量，会影响文件的生成速度，有以下几个可用的值 ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow。
     */
    this.copyByDefaultVal(conf, 'preset', 'medium');
    /**
     * 这里的profile （档次）与lev el （等级）的设置与H . 264 标准文档IS0-14496-PartlO
     * 中描述的pro file 、level 的信息基本相同， x264 编码器支持Baseline 、Extented 、Main 、
     * High 、HighlO 、High422 、High444 共7 种profile 参数设置，
     * 当输出透明视频时 此参数 设置 main 不支持透明通道渲染
     */
    this.copyByDefaultVal(conf, 'vprofile', 'main');
    this.copyByDefaultVal(conf, 'debug', false);
    this.copyByDefaultVal(conf, 'audioLoop', true);
    this.copyByDefaultVal(conf, 'upStreaming', false);
    this.copyByDefaultVal(conf, 'cacheFormat', ext);
    this.copyByDefaultVal(conf, 'hasTransition', false);
    this.copyByDefaultVal(conf, 'defaultOutputOptions', true);
    this.copyFromMultipleVal(conf, 'fps', 'fps', 24);
    this.copyFromMultipleVal(conf, 'rfps', 'rfps', 24);
    this.copyFromMultipleVal(conf, 'width', 'w', 800);
    this.copyFromMultipleVal(conf, 'height', 'h', 450);
    this.copyFromMultipleVal(conf, 'outputDir', 'dir', path.join('./'));
    this.copyFromMultipleVal(conf, 'cacheDir', 'temp', tempy.directory());
    this.copyFromMultipleVal(conf, 'output', 'out', path.join('./', `${this.conf.pathId}.${ext}`));
  }

  /**
   * Get the val corresponding to the key
   * @param {string} key - key
   * @return {any} val
   * @public
   */
  getVal(key) {
    if (key === 'detailedCacheDir') return this.getCacheDir();
    return this.conf[key];
  }

  /**
   * Set the val corresponding to the key
   * @param {string} key - key
   * @param {any} val - val
   * @public
   */
  setVal(key, val) {
    this.conf[key] = val;
  }

  /**
   * Get the width and height in the configuration (add separator)
   * @param {string} dot - separator
   * @retrun {string} 'widthxheight'
   * @public
   */
  getWH(dot = 'x') {
    return this.getVal('width') + dot + this.getVal('height');
  }

  /**
   * Get the cache directory
   * @retrun {string} path
   * @public
   */
  getCacheDir() {
    let cacheDir = this.getVal('cacheDir');
    let pathId = this.getVal('pathId');
    return path.join(cacheDir, pathId);
  }

  copyByDefaultVal(conf, key, defalutVal) {
    this.conf[key] = conf[key] === undefined ? defalutVal : conf[key];
  }

  /**
   * Guarantee that a key must have value
   * @public
   */
  copyFromMultipleVal(conf, key, otherKey, defalutVal) {
    this.conf[key] = conf[key] || conf[otherKey] || defalutVal;
  }

  /**
   * A fake proxy Conf object
   * @public
   */
  static getFakeConf() {
    return fakeConf;
  }
}

const fakeConf = {
  // eslint-disable-next-line
  getVal(key) {
    return null;
  },
  // eslint-disable-next-line
  setVal(key, val) {
    return null;
  },
};

module.exports = Conf;
