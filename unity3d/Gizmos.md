# Gizmos.cs 工具类

 Gizmos.cs 工具类 可以辅助绘制各种元素 在脚本中添加OnDrawGizmosSelected() 在选中对象时绘制元素
 
如果希望辅助元素不依赖对象，可以使用OnDrawGizmos()绘制元素

下面是使用OnDrawGizmos来对选中了raycastTarget的对象绘制边框

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ShowRaycastTarget : MonoBehaviour
{
#if UNITY_EDITOR
    static Vector3[] fourCorners = new Vector3[4];
    private void OnDrawGizmos()
    {
        foreach (MaskableGraphic g in GameObject.FindObjectsOfType<MaskableGraphic>())
        {
            if (g.raycastTarget)
            {
                RectTransform rectTransform = g.transform as RectTransform;
                rectTransform.GetWorldCorners(fourCorners);
                Gizmos.color = Color.blue;
                for (int i = 0; i < 4; i++)
                {
                    Gizmos.DrawLine(fourCorners[i], fourCorners[(i + 1) % 4]);
                }
            }
        }
    }
#endif
}
```
