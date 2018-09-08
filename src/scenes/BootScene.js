import Phaser from 'phaser'
import { SCENE_BOOT, SCENE_GAME } from '../constants/Constants'

export default class BootScene extends Phaser.Scene {
  constructor () {
    super(SCENE_BOOT)
  }

  preload () {
    this.load.image('mushroom', 'assets/mushroom.png')
  }

  create () {
    this.scene.start(SCENE_GAME)
  }
}
