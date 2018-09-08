import Phaser from 'phaser'
import { SCENE_GAME } from '../constants/Constants'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super(SCENE_GAME)
  }

  create () {
    this.mushroom = this.add.sprite(135, 290, 'mushroom')
  }

  update () {
    this.mushroom.angle++
  }
}
