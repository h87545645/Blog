# UIOrder
粒子特效与UI的排序

一般粒子特效在UI上层，但有时候粒子夹在两层UI中间，就需要重新排序了。

在Canvas节点下创建3个UIOrder,分别设置深度0，1，2，这样特效就夹在两个UI之间了，特效可能有多个粒子，所以需要遍历所有粒子，一起设置它们的Order in Layer

代码
```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[AddComponentMenu("UI/UIOrder")]
public class UIOrder : MonoBehaviour
{
    [SerializeField]
    private int _sortingOrder = 0;
    public int sortingOrder
    {
        get
        {
            return _sortingOrder;
        }
        set
        {
            if (_sortingOrder != value)
            {
                _sortingOrder = value;
                Refresh();
            }
        }
    }

    private Canvas _canvas = null;
    public Canvas canvas
    {
        get
        {
            if (_canvas == null)
            {
                _canvas = gameObject.GetComponent<Canvas>();
                if (_canvas == null)
                {
                    _canvas = gameObject.AddComponent<Canvas>();
                }
                _canvas.hideFlags = HideFlags.NotEditable;
            }
            return _canvas;
        }
    }

    public void Refresh()
    {
        canvas.overrideSorting = true;
        canvas.sortingOrder = _sortingOrder;
        foreach (ParticleSystemRenderer particle in transform.GetComponentsInChildren<ParticleSystemRenderer>(true))
        {
            particle.sortingOrder = _sortingOrder;
        }
    }

#if UNITY_EDITOR
    private void OnValidate()
    {
        Refresh();
    }

    private void Reset()
    {
        Refresh();
    }
#endif
}

```
