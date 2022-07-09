# 工作线程 JobSystem & JobHandle

Unity2018起开放了工作线程，我们可以用Job System做一些耗时的事情。


### 如何创建一个job
首先创建一个结构体 实现IJob接口，在接口内部实现Excute()方法，作业的任务处理就放在这个函数之中
NativeArray result 是一个返回结果的数组，这是一种共享的数组

```
[BurstCompile]
public struct MyJob : IJob
{
    public float a;
    public float b;
    public NativeArray<float> result;

    public void Execute()
    {
        result[0] = a + b;
    }
}

```

当调用Job的Schedule方法时，它将返回JobHandle。您可以在代码中使用JobHandle 作为其他Job的依赖。如果一个Job依赖于另一个Job的结果，则可以将第一个Job的JobHandle参数作为参数传递给第二个Job的Schedule方法，如下所示：
```

JobHandle firstJobHandle = firstJob.Schedule();
secondJob.Schedule(firstJobHandle);
```

如果Job具有许多依赖关系，则可以使用JobHandle.CombineDependencies方法合并它们。CombineDependencies允许您将它们（JobHandle）作为参数

```
NativeArray<JobHandle> handles = new NativeArray<JobHandle>(numJobs, Allocator.TempJob);
 
// Populate `handles` with `JobHandles` from multiple scheduled jobs...
 
JobHandle jh = JobHandle.CombineDependencies(handles);
```


### IJobParallelFor

在调度作业时，只能有一个作业正在执行一项任务。在游戏中，通常希望对大量对象执行相同的操作。这个接口可以实现一个作业执行多个任务

```
// 将两个浮点值相加的作业
public struct MyParallelJob : IJobParallelFor
{
    [ReadOnly]
    public NativeArray<float> a;
    [ReadOnly]
    public NativeArray<float> b;
    public NativeArray<float> result;

    public void Execute(int i)
    {
        result[i] = a[i] + b[i];
    }
}
```

```
NativeArray<float> a = new NativeArray<float>(2, Allocator.TempJob);

NativeArray<float> b = new NativeArray<float>(2, Allocator.TempJob);

NativeArray<float> result = new NativeArray<float>(2, Allocator.TempJob);

a[0] = 1.1;
b[0] = 2.2;
a[1] = 3.3;
b[1] = 4.4;

MyParallelJob jobData = new MyParallelJob();
jobData.a = a;  
jobData.b = b;
jobData.result = result;

// 调度作业，为结果数组中的每个索引执行一个 Execute 方法，且每个处理批次只处理一项
JobHandle handle = jobData.Schedule(result.Length, 1);

// 等待作业完成
handle.Complete();

// 释放数组分配的内存
a.Dispose();
b.Dispose();
result.Dispose();
```

###  ParallelForTransform
ParallelForTransform类型的Job
一个ParallelForTransform类型的Job是另一种类型的ParallelFor类型的Job ，专为在Transforms上运行而设计。

注意：ParallelForTransform类型的Job是Unity中所有实现IJobParallelForTransform接口的Job的统称。

`例`

```
using System.Collections;
using System.Collections.Generic;
using Unity.Collections;
using Unity.Jobs;
using UnityEngine;
using UnityEngine.Jobs;

public class TimelineTest : MonoBehaviour
{
    public Transform[] cubes;


    // Update is called once per frame
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            NativeArray<Vector3> position = new NativeArray<Vector3>(cubes.Length, Allocator.Persistent);
            for(int i = 0; i < position.Length; i++)
            {
                position[i] = Vector3.one * i;
            }
            //设置transform
            TransformAccessArray transfromArray = new TransformAccessArray(cubes);
            MyJob job = new MyJob() { position = position };
            JobHandle jobHandle = job.Schedule(transfromArray);
            //等待工作线程结束
            jobHandle.Complete();
            transfromArray.Dispose();
            position.Dispose();
        }
    }

    struct MyJob : IJobParallelForTransform
    {
        [ReadOnly] public NativeArray<Vector3> position;
        public void Execute(int index, TransformAccess transform)
        {
            //工作线程中设置坐标
            transform.position = position[index];
        }
    }
}
```

其中 [Unity基础—C#中 Dispose]()
