import { singleton } from "../../core/decorator";
import UIAdapter from "../../core/ui/UIAdapter";
import { UIManageEvent } from "../../core/ui/UIDefine";
import { GameUIEvent } from "../../game/enum/GameEvent";

const { ccclass, property } = cc._decorator;
enum TouchState{
    None = 0,
    Ver = 1,
    Hor = 2,
}

/**
 * 拖拽并吸附到屏幕边上
 */
@ccclass
export default class DragAttachHelper extends cc.Component {
    @property(cc.Node)
    dragNode: cc.Node = null;

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;

    @property()
    paddingTop: number = 200;

    @property()
    paddingBottom: number = 200;

    public isLimitVertical : boolean = true;

    private _enableRect: cc.Rect = null;
    // private _canDrag: boolean = false;
    private _touchState : TouchState = TouchState.None;
    private _banScroll : boolean = false;

    protected onLoad(): void {
        this.dragNode = this.dragNode || this.node;
   
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this,true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this,true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this,true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCancel, this,true);
        // this.node.pauseSystemEvents(false);
        // (this.node as any)._touchListener.setSwallowTouches(false);
        // this.node.on("subStart", (e:cc.Event.EventCustom)=>{
        //     this._touchStart(e.getUserData())
        // }, this);
        // this.node.on("subMove", (e:cc.Event.EventCustom)=>{
        //     this._touchMove(e.getUserData())
        // }, this);
        // this.node.on("subEnd",  (e:cc.Event.EventCustom)=>{
        //     this._touchEnd(e.getUserData())
        // }, this);
        // this.node.on("subCancel", (e:cc.Event.EventCustom)=>{
        //     this._touchCancel(e.getUserData())
        // }, this);
        EventCenter.addListener(UIManageEvent.GameUIResize, this._calculateEnableRect, this);
        // this._canDrag = true;
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this,true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this,true);
        this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this,true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchCancel, this,true);
        // this.node.off("subStart", this._touchStart, this);
        // this.node.off("subMove", this._touchMove, this);
        // this.node.off("subEnd", this._touchEnd, this);
        // this.node.off("subCancel", this._touchCancel, this);
        EventCenter.removeListener(UIManageEvent.GameUIResize, this);
    }

    protected start(): void {
        singleton.get(UIAdapter).updateAdapter();
        this._calculateEnableRect();
        this.scheduleOnce(()=>{
            let currPos = this._getvalidPos();
            this.dragNode.setPosition(cc.v2(currPos.x, 300));
        },0);
    }

    private _touchStart(event) {
        this._touchState = TouchState.None;
    }

    private _touchMove(event) {
        if (this._touchState == TouchState.None) {
            if (Math.abs(event.getDelta().y) > 0.5) {
                this._touchState = TouchState.Ver;
            }else if (Math.abs(event.getDelta().x) > 0.2) {
                // (this.node as any)._touchListener.setSwallowTouches(true);
                this._touchState = TouchState.Hor;
                EventCenter.sendEvent(GameUIEvent.DragAttachStart);
                // this.banNode.pauseSystemEvents(true);
                this.dragNode.stopAllActions();
                if (this.scroll.enabled) {
                    this.scroll.enabled = false;
                    this._banScroll = true;
                }
            }
            if (!this.isLimitVertical) {
                this._touchState = TouchState.Hor;
                EventCenter.sendEvent(GameUIEvent.DragAttachStart);
                // this.banNode.pauseSystemEvents(true);
                this.dragNode.stopAllActions();
                if (this.scroll.enabled) {
                    this.scroll.enabled = false;
                    this._banScroll = true;
                }
            }
        }
        if (this._touchState == TouchState.Hor) {
            this.dragNode.opacity = 155;
            this.dragNode.setPosition(this.dragNode.x + event.getDelta().x, this.dragNode.y + event.getDelta().y);
        }
    }

    private _touchEnd(event) {
        this._move2validPos();
        this._touchState = TouchState.None;
        if (this._banScroll) {
            this._banScroll = false;
            this.scroll.enabled = true;
        }
        // this.banNode.resumeSystemEvents(true);
        // this.scheduleOnce(()=>{
        //     (this.node as any)._touchListener.setSwallowTouches(false);
        // },0);
    }

    private _touchCancel(event) {
        this._move2validPos();
        this._touchState = TouchState.None;
        if (this._banScroll) {
            this._banScroll = false;
            this.scroll.enabled = true;
        }
        // this.banNode.resumeSystemEvents(true);
        // this.scheduleOnce(()=>{
        //     (this.node as any)._touchListener.setSwallowTouches(false);
        // },0);
    }

    private _move2validPos() {
        this.dragNode.stopAllActions();
        // this._canDrag = false;
        let currPos = this._getvalidPos();
        this.dragNode.runAction(cc.sequence(cc.spawn(cc.moveTo(0.2, currPos).easing(cc.easeOut(2)), cc.fadeTo(0.2, 255)), cc.callFunc(() => {
            // this._canDrag = true;
        })));
    }

    private _getvalidPos(){
        let currPos = this.dragNode.convertToWorldSpaceAR(cc.v2(0, 0));
        if (currPos.x > (this._enableRect.xMax + this._enableRect.xMin) / 2) {
            currPos.x = this._enableRect.xMax;
            EventCenter.sendEvent(GameUIEvent.EntranceDirection,1);
        }else{
            currPos.x = this._enableRect.xMin;
            EventCenter.sendEvent(GameUIEvent.EntranceDirection,0);
        }
        
        currPos.y = Math.max(currPos.y, this._enableRect.yMin);
        currPos.y = Math.min(currPos.y, this._enableRect.yMax);
        currPos = this.dragNode.parent.convertToNodeSpaceAR(currPos);
        return currPos;
    }

    private _calculateEnableRect() {
        let visibleSize = singleton.get(UIAdapter).visibleSize;
        let left = this.dragNode.width * this.dragNode.anchorX;
        let right = visibleSize.width - this.dragNode.width * (1 - this.dragNode.anchorX) - left;
        let down = this.dragNode.height * this.dragNode.anchorY + this.paddingBottom;
        let up = visibleSize.height - this.dragNode.height * (1 - this.dragNode.anchorY) - this.paddingTop - down;
        this._enableRect = new cc.Rect(left, down, right, up);
    }
}
