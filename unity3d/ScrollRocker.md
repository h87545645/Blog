# ScrollRocker
游戏中经常出现的虚拟摇杆，可以用ScrollRect来简单的实现
```
public class ScrollRocker : ScrollRect
{
    protected float mRadius = 0f;
    // Start is called before the first frame update
    protected override void Start()
    {
        base.Start();
        mRadius = (transform as RectTransform).sizeDelta.x * 0.5f;
    }

    public override void OnDrag(PointerEventData eventData)
    {
        base.OnDrag(eventData);
        var contentPostion = this.content.anchoredPosition;
        if (contentPostion.magnitude > mRadius)
        {
            contentPostion = contentPostion.normalized * mRadius;
            SetContentAnchoredPosition(contentPostion);
        }
    }
}
```
继承ScrollRect，mRadius是摇杆区域的半径， 重写OnDrag，移动content的位置，最后在Inspector将滑块拖成content即可
