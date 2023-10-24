# cococ-creator 利用camera截图

有时会出现多个界面同时显示的情况，比如大厅时多个弹窗同时弹出或者公告同时显示显示

以前的做法是隐藏在后面的弹窗和大厅等来降低draw call,缺点是隐藏后背景空了不好看

这次在研究shader时想到可以在隐藏大厅背景时先利用camera截个图来优化效果

部分代码

```
    let mCamera = cc.Camera.main;
    let renderTexture = new cc.RenderTexture();
// set texture size
		let visibleSize = singleton.get(UIAdapter).visibleSize;
		let adaptScale = Math.min(singleton.get(UIAdapter).adaptScale,1);
		renderTexture.initWithSize(visibleSize.width/adaptScale, visibleSize.height/adaptScale , cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
		// render texture
		mCamera.targetTexture = renderTexture;
		mCamera.render(renderNode);

// create sprite , set texture to sprite
		
		outputSprite.spriteFrame = new cc.SpriteFrame();
		outputSprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
		outputSprite.node.setContentSize(renderTexture.width,renderTexture.height);
		outputSprite.spriteFrame.setTexture(renderTexture);
		// invert sprite axis Y 
		if (outputSprite.node.scaleY > 0) {
			outputSprite.node.scaleY = -Math.abs(outputSprite.node.scaleY);
		}
```
核心逻辑是 创建RenderTexture 设置camera的targetTexture *mCamera.targetTexture = renderTexture;*

渲染后用renderTexture创建spriteframe 用来显示

[完整代码]()

