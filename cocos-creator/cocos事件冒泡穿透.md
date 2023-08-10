# cocos悬浮框组件总结

需求：
实现一个可拖动到任意位置的悬浮框。

尝试了3种方式


## 1.父节点事件冒泡

由于悬浮组件内也有scrollview 和 button等组件，会吞掉touch事件。
使用事件冒泡来向父节点传递touch
缺点是要找到所有button去做事件冒泡,且touch位置，拖动等还要重新计算，略复杂。

## 2.兄弟节点拖动

在悬浮组件内容节点同级上做一个拖动节点，并在内容上层，拖动节点会阻挡touch
(this.node as any)._touchListener.setSwallowTouches(false) 来防止事件吞噬
缺点是setSwallowTouches已经过时了，只能在web上运行，原声环境并不能使用

## 3.父节点优先监听

最后找到一种简单的实现
this.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
这是一个普通的touch监听,但其实还可以传入第四个参数

@param useCapture — When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.

useCapture 可以在事件捕获阶段就响应，而不是在冒泡阶段

this.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this,true);

这样也就不怕被子节点吞噬touch了

[完整组件代码]()
