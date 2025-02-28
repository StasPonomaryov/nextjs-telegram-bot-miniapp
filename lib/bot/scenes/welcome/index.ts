import { Scenes } from 'telegraf';
import { CustomContext } from '../../../../types/bot';
import commonInteractions from "../../base/commonInteractions";
import SceneEnter from './presenters';

const welcomeScene = new Scenes.BaseScene<CustomContext>('welcome');
// User entered scene
welcomeScene.enter(SceneEnter);
// Listen to global commands, menu buttons and phrases
commonInteractions(welcomeScene);

export default welcomeScene;
