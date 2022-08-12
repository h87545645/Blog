# 在unity中使用shader

对于GPU渲染管线的原理更多还是在理论层面，这篇文章主要实践在unity引擎里从头开始实现一个简单的shader效果，从而更好的理解GPU渲染的过程中的各个步骤。

在project视图下右键，create/shader/unlit shader
创建好后删除所有代码，从头开始写

首先需要`Shader{}`代码块 
```
Shader "MyFirstShader"
{
}
```
Shader后面定义当前shader的名字

然后可以定义一些`Properties `,可以理解成类的成员变量，可以在shader的inspector里显示，如`_Color("Color",color) = (1,1,0,1)`
_Color是变量名，"Color"是编辑器里展示的名字，color是类型
```
	Properties
	{
		_Color("Color",color) = (1,1,0,1)
		_BaseMap("Base Map",2D) = "white" {}
	}
```
_BaseMap 是2D类型的贴图坐标

接下来是`SubShader {}`块和`Pass {}`块
一个shader有一个或多个subshader pass 块里是逻辑工作的地方
在pass中代码要包含在`HLSLPROGRAM` `ENDHLSL`之间，表示使用`HLSL`语言编写，
然后指定顶点与像素着色器的入口，定义参数Attributes Varyings
Vertex函数是顶点着色器 返回值给像素着色器Pixel函数
```
#pragma vertex Vertex
#pragma fragment Pixel

		half4 _Color;
		sampler2D _BaseMap;

			struct Attributes
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};


	//变体 返回值修饰顶点着色器输出的裁切空间位置也需要与SV_POSITION做关联
			struct Varyings
			{
				float4 positionCS: SV_POSITION;
				float2 uv : TEXCOORD0;
			};
```
`Attributes`是Vertex函数需要的参数，其返回`Varyings `给Pixel函数
```
//顶点着色器 返回值给像素着色器
			Varyings Vertex(Attributes IN)
			{
				//mvp float4 w 传入1 表示一个点 与TransformObjectToHClip函数效果一样
				/*float4 positionWS = mul(UNITY_MATRIX_M,float4(vertex.xyz,1.0));
				float4 positionCS = mul(UNITY_MATRIX_VP, float4(positionWS.xyz, 1.0));*/

				//return positionCS;
				//return TransformObjectToHClip(vertex);

				Varyings OUT;
				OUT.positionCS = TransformObjectToHClip(IN.vertex.xyz);
				OUT.uv = IN.uv;
				return OUT;
			}
			//像素着色器
			half4 Pixel(Varyings IN) :SV_TARGET
			{
				half4 color;
				color.rgb = tex2D(_BaseMap,IN.uv).rgb * _Color;
				color.a = 1.0;
				return color;
			}
```
TransformObjectToHClip是内置的矩阵函数，
Pixel函数中将color赋值为定义的_BaseMap颜色并返回

上面完成后就可以在编辑器里配置shader的颜色和贴图了
这时我们放置一个平行光，可以发现我们的立方体是没有任何光照效果的
接下来我们继续给shader添加光照效果
着色处理是计算光照并由此决定像素颜色的过程，存在3种常见的着色处理方法：平滑着色、高洛德着色与冯氏着色。
- 平滑着色（Flat shading）：简单来讲，就是一个三角面用同一个颜色。如果一个三角面的代表顶点(也许是按在index中的第一个顶点)，恰好被光照成了白色，那么整个面都会是白的。

- 高洛德着色（Gouraud shading）：每顶点求值后的线性插值结果通常称为高洛德着色。在高洛德着色的实现中，顶点着色器传递世界空间的顶点法线和位置到Shade( ) (首先确保法线矢量长度为1），然后将结果写入内插值。像素着色器将获取内插值并将其直接写入输出。 高洛德着色可以为无光泽表面产生合理的结果，但是对于强高光反射的表面

- 冯氏着色（Phong shading）：冯氏着色是对着色方程进行完全的像素求值。在冯氏着色实现中，顶点着色器将世界空间法线和位置写入内插值，此值通过像素着色器传递给Shade( )函数。而将Shade( )函数返回值写入到输出中。请注意，即使表面法线在顶点着色器中缩放为长度1，插值也可以改变其长度，因此可能需要在像素着色器中再次执行此归一化操作。

我们先来试试高洛德着色
导入光线文件
#include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

Attributes里添加法线 float3 normal : NORMAL;
```
struct Attributes
{
	float4 vertex : POSITION;
	float2 uv : TEXCOORD0;
	float3 normal : NORMAL;  
};

struct Varyings
{
	float4 positionCS: SV_POSITION;
	float2 uv : TEXCOORD0;
	float3 normalWS : NORMAL;
};
```

Vertex里也要返回法线数据
```
Varyings Vertex(Attributes IN)
{
	//mvp float4 w 传入1 表示一个点 与TransformObjectToHClip函数效果一样
	/*float4 positionWS = mul(UNITY_MATRIX_M,float4(vertex.xyz,1.0));
	float4 positionCS = mul(UNITY_MATRIX_VP, float4(positionWS.xyz, 1.0));*/

	//return positionCS;
	//return TransformObjectToHClip(vertex);

	Varyings OUT;
	OUT.positionCS = TransformObjectToHClip(IN.vertex.xyz);
	OUT.normalWS = TransformObjectToWorldNormal(IN.normal);
	OUT.uv = IN.uv;
	return OUT;
}
```

Light light = GetMainLight();获得光源数据
float normalWS = normalize(IN.normalWS);获得法线向量


```
//像素着色器 (只表现颜色一般half即可) 
half4 Pixel(Varyings IN) :SV_TARGET
{
	half4 color;
	Light light = GetMainLight();
	float normalWS = normalize(IN.normalWS);
	float NoL = max(0, dot(IN.normalWS , /*_MainLightPosition.xyz*/ light.direction)); //_MainLightPostion是平行光朝向， 将法线位置normalWS与灯光点乘
	half3 gi = SampleSH(IN.normalWS) * 0.08;// 球谐函数 SampleSH 采样环境低频信息 作为环境光结果
	color.rgb = tex2D(_BaseMap,IN.uv).rgb * _Color * NoL * /*_MainLightColor.rgb*/light.color + gi;
	color.a = 1.0;
	return color;
}
```


[完整shader文件](https://github.com/h87545645/u3d_proj/blob/main/Assets/GameAssets/Materials/MyFirstShader.shader)

