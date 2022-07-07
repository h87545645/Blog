# c# SortedDictionary

>1、SortedDictionary 泛型类

>SortedDictionary 泛型类是检索运算复杂度为 O(log n) 的二叉搜索树，其中 n 是字典中的元素数。就这一点而言，它与 SortedList 泛型类相似。这两个类具有相似的对象模型，并且都具有 O(log n) 的检索运算复杂度。这两个类的区别在于内存的使用以及插入和移除元素的速度：
SortedList 使用的内存比 SortedDictionary 少。
SortedDictionary 可对未排序的数据执行更快的插入和移除操作：它的时间复杂度为 O(log n)，而SortedList 为 O(n)。
如果使用排序数据一次性填充列表，则 SortedList 比 SortedDictionary 快。
每个键/值对都可以作为 KeyValuePair 结构进行检索，或作为 DictionaryEntry 通过非泛型 IDictionary 接口进行检索。
只要键用作 SortedDictionary 中的键，它们就必须是不可变的。SortedDictionary 中的每个键必须是唯一的。键不能为空引用（在 Visual Basic 中为 Nothing），但是如果值类型 TValue 为引用类型，该值则可以为空。
SortedDictionary 需要比较器实现来执行键比较。可以使用一个接受 comparer 参数的构造函数来指定IComparer 泛型接口的实现；如果不指定实现，则使用默认的泛型比较器 Comparer.Default。如果类型 TKey实现 System.IComparable 泛型接口，则默认比较器使用该实现。
C# 语言的 foreach 语句，需要集合中每个元素的类型。由于 SortedDictionary 的每个元素都是一个键/值对，因此元素类型既不是键的类型，也不是值的类型。而是 KeyValuePair 类型

[原文地址](http://www.icodebang.com/article/133786.html)


SortedDictionary没有按照插入顺序排列 而是一种string 排序 ，根据key值进行
可以看作是自动排序的Dictionary
其顺序为

数字>小写字母>大写字母

数字会排在最前
