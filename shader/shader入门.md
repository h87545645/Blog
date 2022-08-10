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


[完整shader文件](https://github.com/h87545645/u3d_proj/blob/main/Assets/GameAssets/Materials/MyFirstShader.shader)

