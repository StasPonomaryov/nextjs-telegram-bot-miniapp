import { Scenes } from 'telegraf';
import welcomeScene from '../scenes/welcome';
import { CustomContext } from '../../../types/bot';

const stage = new Scenes.Stage<CustomContext>([
  welcomeScene,
]);

export default stage;