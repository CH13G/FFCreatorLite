'use strict';

/**
 * FFVideo - Video component-based display component
 *
 * ####Example:
 *
 *     const video = new FFVideo({ path, width: 500, height: 350, loop: true });
 *     scene.addChild(video);
 *
 *
 * @class
 */
const isNumber = require('lodash/isNumber');
const { isAlpha } = require('../utils/utils');
const FFImage = require('./image');

class FFVideo extends FFImage {
  constructor(conf = { x: 0, y: 0, animations: [] }) {
    super({ type: 'video', ...conf });
    // this.addVideoPreFilter();
  }

  /**
  * Add video  preprocessing filter parameters
  * @private
  */
  addVideoPreFilter() {
    if (isAlpha(this.getPath())) {
      this.addPreFilter('format=yuva420p');
    }
  }

  /**
   * Add video ffmpeg input
   * ex: loop 1 -t 20  -i imgs/logo.png
   * @private
   */
  addInput(command) {
    const { loop, delay } = this.conf;

    if (loop) {
      const num = isNumber(loop) ? isNumber(loop) : -1;
      command.addInput(this.getPath()).inputOption('-stream_loop', `${num}`);
    } else {
      command.addInput(this.getPath());
    }
    if (isAlpha(this.getPath())) {
      command.addInputOption(['-c:v', 'libvpx-vp9']);
    }
    if (delay) command.inputOption('-itsoffset', delay);
  }

  setLoop(loop) {
    this.conf.loop = loop;
  }

  setDelay(delay) {
    this.conf.delay = delay;
  }

  isReady() {
    return new Promise(resolve => resolve());
  }
}

module.exports = FFVideo;
