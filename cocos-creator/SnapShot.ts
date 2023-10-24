import { singleton } from "../../core/decorator";
import UIAdapter from "../../core/ui/UIAdapter";


const { ccclass, property, executeInEditMode } = cc._decorator;

// @ccclass('SnapShopItem')
// class SnapShopItem {

// 	@property(cc.Node)
// 	dialogNode: cc.Node = null;

// 	@property(cc.Sprite)
// 	outputSprite: cc.Sprite = null;

// 	@property(cc.Camera)
// 	mCamera: cc.Camera = null;

// 	@property(cc.RenderTexture)
// 	texture: cc.RenderTexture = null;

// }

@ccclass
// @executeInEditMode
export default class SnapShot extends cc.Component {

	// @property({
	// 	visible: true,
	// 	type: [SnapShopItem]
	// })
	// private snapNodes: SnapShopItem[] = [];

	// @property(cc.Camera)
	// renderCamera: cc.Camera = null;

	// @property(cc.Sprite)
	// outputSprite: cc.Sprite = null;

	// private static _mIns: SnapShot = null;
	// public static getInstance() {
	// 		return SnapShot._mIns;
	// }


	private _previousGoup = null;


	// protected onLoad(): void {
	// 	SnapShot._mIns = this;
	// }

	// protected onDestroy(): void {
	// 	SnapShot._mIns = null;
	// }



	/**
	 * 
	 * @param renderNode 
	 * @param outputSprite 
	 * @param scale renderNode or its parent scale
	 */
	public startSnapShot(renderNode: cc.Node, outputSprite: cc.Sprite , scale : number = 1) {
		if (!outputSprite) {
			return;
		}
		outputSprite.node.stopAllActions();
		let mCamera = cc.Camera.main;
		// let originCullingMask = cc.Camera.main.cullingMask
		// //只保留default
		// mCamera.cullingMask = 1


		this.resetSnapShot(outputSprite);
		// create renderTexture
		let renderTexture = new cc.RenderTexture();
		mCamera.node.active = true;
		let previousPos = mCamera.node.getPosition();
		let previousScale = mCamera.zoomRatio;
		mCamera.zoomRatio = 1 / scale;
		this._setCameraPos(mCamera.node , renderNode);
		// this._previousGoup = renderNode.group;
		// set renderNode to specific group for render
		// renderNode.group = "snapshot";
		// set texture size
		let visibleSize = singleton.get(UIAdapter).visibleSize;
		let adaptScale = Math.min(singleton.get(UIAdapter).adaptScale,1);
		renderTexture.initWithSize(visibleSize.width/adaptScale, visibleSize.height/adaptScale , cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
		// render texture
		mCamera.targetTexture = renderTexture;
		mCamera.render(renderNode);
		// renderTexture.setPremultiplyAlpha(true);
		// create sprite , set texture to sprite
		
		outputSprite.spriteFrame = new cc.SpriteFrame();
		outputSprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
		outputSprite.node.setContentSize(renderTexture.width,renderTexture.height);
		outputSprite.spriteFrame.setTexture(renderTexture);
		// invert sprite axis Y 
		if (outputSprite.node.scaleY > 0) {
			outputSprite.node.scaleY = -Math.abs(outputSprite.node.scaleY);
		}
		// fallback to previous group
		// renderNode.group = this._previousGoup;
		outputSprite.node.opacity = 255;
		mCamera.node.setPosition(previousPos);
		mCamera.zoomRatio = previousScale;
		mCamera.targetTexture = null;
	}

	public resetSnapShot(outputSprite: cc.Sprite , isFadeOut : boolean = false){
		if (!outputSprite) {
			return;
		}

		if (outputSprite.spriteFrame != null) {
			// outputSprite.spriteFrame?.setTexture(null);
			outputSprite.spriteFrame?.getTexture()?.destroy();
			outputSprite.spriteFrame?.destroy();
			outputSprite.spriteFrame = null;
		}
		if (isFadeOut) {
			outputSprite.node.stopAllActions();
			outputSprite.node.runAction(cc.fadeOut(0.15));
		}else{
			outputSprite.node.opacity = 0;
		}
	}

	private _setCameraPos(mCamera : cc.Node , renderNode: cc.Node){
		let pos = renderNode.convertToWorldSpaceAR(cc.v2(0,0));
		pos = mCamera.parent.convertToNodeSpaceAR(pos);
		mCamera.setPosition(pos);
		// this.renderCamera.node.parent = renderNode.parent;
		// this.renderCamera.node.setPosition(cc.v2(0,0));
	}


}
