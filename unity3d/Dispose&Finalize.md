# Unity基础—C#中Dispose和 Finalize

要讨论这两个方法，首先要知道C#的 GC，因为有了 GC，所以开发者才能专注于应用程序的功能；然而 GC 也有局限性，它只能释放托管内存中的对象；像文件句柄，网络套接字，数据库链接这种非托管资源，GC 就无法帮你释放了。如果不释放这些资源，就会导致应用程序一直引用它们，而其他应用程序就无法对它们进行操作（比如：当你打开Word 文件，然后删除它的时候就会弹出：操作无法完成，因为文件已经在 Microsoft Office Word中打开）

C# 内的 Dispose() 和 Finalize() 方法，就是释放对象中非托管资源的方法。如果你想在自定义的类里面实现 Dispose() 方法，那么就得引用 IDisposable 接口；你可能见过使用 using 的代码，它其实就是try/finally格式的语法糖，在finally内会主动调用 Dispose() 方法，所以当你遇到非托管资源的操作，using是个很安全的做法。当然，你也可以在使用完该对象以后，主动调用它的 Dispose() 方法

那么问题来了，既然有 Dispose() 方法，为什么还需要 Finalize() 方法呢？ 因为有时候持有非托管资源的变量可能被用在很多地方，我们无法显示判断在何时调用 Dispose() 方法释放该资源。只有在 GC 的时候，我们判断引用该非托管资源的变量已经不被任何其他对象引用，这时候才是合适的释放时机。然而GC过程是内部实现的，我们无法在 GC 过程中手动调用 Dispose() 方法，所以 Finalize() 方法的用处就来了，GC 会自动调用 Finalize() 方法，我们只要把释放非托管内存的代码写在 Finalize() 方法中，就能释放非托管内存了

那么 Finalize() 是怎么被调用的呢？ 当程序运行以后，GC会收集实现了 Finalize() 方法的对象，并把他们放入一个队列。当某个对象可以释放内存的时候：GC会把它所持有的非托管内存释放，并从队列中移除；但请注意，该对象在托管堆中并未释放。只有在下一次 GC 的时候，才会从托管堆中释放该对象

至此，我们已经了解了 Dispose() 和 Finalize() 方法，那是不是可以让他们两完美组合呢？既可以让用户手动调用，也可以做个托底，让GC自动调用。肯定可以的，代码如下：

```
using System;
public class FinailzeTest : IDisposable
{
    //GC自动调用
    ~FinailzeTest() { Dispose(false); }

    //用户手动调用
    public void Dispose() { Dispose(true); }

    protected virtual void Dispose(bool disposing)
    {
        //释放托管资源 
        if (disposing) { managedObject = null; }
        //释放非托管资源
        unManagedObjectDispose();
        //告诉GC, 把该类对象从列表中移除, 到时候不再执行Finalize()方法
        if (disposing)
        {
            GC.SuppressFinalize(this);
        }
    }
}
```

如果用户没有主动调用 Dispose() ，未能及时释放托管和非托管资源，那么在垃圾回收时，会执行Finalize()，释放非托管资源（注意：非托管资源并未被释放）
；如果用户主动调用了 Dispose()，就能及时释放了托管和非托管资源，而且垃圾回收的时候不会执行 Finalize() 方法，提高了性能
[原文地址](https://zhuanlan.zhihu.com/p/390457469)
