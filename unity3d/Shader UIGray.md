# Shader UIGray
shader 可以方便的实现很多效果，比如有时我们想让按钮或者图片置灰，可以遍历节点下所有Image，将Material修改为置灰的shader。
```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if UNITY_EDITOR
using UnityEditor;
#endif

[DisallowMultipleComponent]
public class UIGray : MonoBehaviour
{
    private bool _isGray = false;
    public bool isGray
    {
        get { return _isGray; }
        set
        {
            if (_isGray != value)
            {
                _isGray = value;
                SetGray(isGray);
            }
        }
    }

    static private Material _defaultGrayMaterial;
    static private Material grayMaterial
    {
        get
        {
            if (_defaultGrayMaterial == null)
            {
                _defaultGrayMaterial = new Material(Shader.Find("UI/UIGray"));
            }
            return _defaultGrayMaterial;
        }
    }

    void SetGray(bool isGray)
    {
        int i = 0, count = 0;
        Image[] images = transform.GetComponentsInChildren<Image>();
        count = images.Length;
        for (i = 0; i < count; i++)
        {
            Image g = images[i];
            if (isGray)
            {
                g.material = grayMaterial;
            }
            else
            {
                g.material = null;
            }
        }
    }

#if UNITY_EDITOR
    [CustomEditor(typeof(UIGray))]
    public class UIGrayInspector : Editor
    {
        public override void OnInspectorGUI()
        {
            base.OnInspectorGUI();
            UIGray gray = target as UIGray;
            gray.isGray = GUILayout.Toggle(gray.isGray, "isGray");
            if (GUI.changed)
            {
                EditorUtility.SetDirty(target);
            }
        }
    }
#endif

}

```

我们可以创建一个shader文件，找到fixed4 frag 方法，将最后返回的颜色改为gray
```
Shader "UI/UIGray"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
    }
    SubShader
    {
        // No culling or depth
        Cull Off ZWrite Off ZTest Always

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            sampler2D _MainTex;

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 col = tex2D(_MainTex, i.uv);
                // just invert the colors
                col.rgb = 1 - col.rgb;
                float gray = dot(col.xyz, float3(0.299, 0.587, 0.114));
                col.xyz = float3(gray, gray, gray);
                return col;
            }
            ENDCG
        }
    }
}

```

其中Shader.Find的参数就是我们创建的shader的名字 Shader "UI/UIGray"
