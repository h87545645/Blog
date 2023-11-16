
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("编辑器组件/关闭spine预览")
export default class CloseDebugSpineInEditorTool extends cc.Component {

    resetInEditor() {
        if (!CC_EDITOR) return;

        cc['engine']._animatingInEditMode = 0;

        sp.Skeleton.prototype.update = function(dt) {
            if (CC_EDITOR) return;
            if (this.paused) return;
    
            dt *= this.timeScale * sp.timeScale;
    
            if (this.isAnimationCached()) {
    
                // Cache mode and has animation queue.
                if (this._isAniComplete) {
                    if (this._animationQueue.length === 0 && !this._headAniInfo) {
                        let frameCache = this._frameCache;
                        if (frameCache && frameCache.isInvalid()) {
                            frameCache.updateToFrame();
                            let frames = frameCache.frames;
                            this._curFrame = frames[frames.length - 1];
                        }
                        return;
                    }
                    if (!this._headAniInfo) {
                        this._headAniInfo = this._animationQueue.shift();
                    }
                    this._accTime += dt;
                    if (this._accTime > this._headAniInfo.delay) {
                        let aniInfo = this._headAniInfo;
                        this._headAniInfo = null;
                        this.setAnimation (0, aniInfo.animationName, aniInfo.loop);
                    }
                    return;
                }
    
                this._updateCache(dt);
            } else {
                this._updateRealtime(dt);
            }
        }

        this.node.removeComponent(CloseDebugSpineInEditorTool);
    }
}
