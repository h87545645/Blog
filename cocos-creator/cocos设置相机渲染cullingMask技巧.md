# cocos设置相机渲染cullingMask技巧

camera 的cullingMask决定了该相机会渲染哪些group的节点。
![camera]( https://github.com/h87545645/Blog/blob/main/image/cocos_camera.png "camera")

如果是在代码里设置cullingMask则需要用到位运算技巧

```js
// 当相机everything 时，cullingMask 为 -1，即32个1，0xffffffff；
// 当相机nothing 时，cullingMask 等于 0；

// 渲染除去层x的所有层
camera.cullingMask = ~(1 << x);            
// 关闭(减掉)层 x      
camera.cullingMask &= ~(1 << x);  
// 打开(增加)层 x      
camera.cullingMask |= (1 << x);  
// 摄像机只显示第x层, y层, z层.
camera.cullingMask = (1 << x) + (1 << y)  + (1 << z); 

```

