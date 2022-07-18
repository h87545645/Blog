# 元组 Tuple
Tuple
Tuple类是在 .NET Framework4.0 中引入的。元组是一种包含不同数据类型的元素序列的数据结构。它可以用于需要数据结构来保存具有属性的对象，但又不想为其创建单独类型的情况。

语法：

Tuple<T1, T2, T3, T4, T5, T6, T7, TRest>

下面的示例创建一个包含三个元素的元组：

Tuple<int, string, string> person = new Tuple <int, string, string>(1, "Steve", "Jobs");

在上面的示例中，我们创建了一个Tuple包含一个人的记录的实例。我们为每个元素指定一种类型，并将值传递给构造函数。指定每个元素的类型很麻烦。C#引入了一个静态帮助器类Tuple，，该类返回Tuple 的实例，而不必指定每个元素的类型，如下所示。

var person = Tuple.Create(1, "Steve", "Jobs");

一个元组最多只能包含八个元素。当您尝试包含八个以上的元素时，它将产生编译器错误。

var numbers = Tuple.Create(1, 2, 3, 4, 5, 6, 7, 8);

访问元组元素
元组元素可以通过 Item < elementnumber > 属性访问，例如 Item1、 Item2、 Item3等，最多可以访问 Item7属性。Item1属性返回第一个元素，Item2返回第二个元素，依此类推。最后一个元素(第8个元素)将使用 Rest 属性返回。
```
var person = Tuple.Create(1, "Steve", "Jobs");
person.Item1; // 返回 1
person.Item2; // 返回 "Steve"
person.Item3; // 返回 "Jobs"


var numbers = Tuple.Create("One", 2, 3, "Four", 5, "Six", 7, 8);
numbers.Item1; // 返回 "One"
numbers.Item2; // 返回 2
numbers.Item3; // 返回 3
numbers.Item4; // 返回 "Four"
numbers.Item5; // 返回 5
numbers.Item6; // 返回 "Six"
numbers.Item7; // 返回 7
numbers.Rest; // 返回 (8)
numbers.Rest.Item1; // 返回 8
```
通常，第8个位置用于嵌套元组，您可以使用Rest属性访问该位置。

嵌套元组
如果要在一个元组中包含八个以上的元素，则可以通过嵌套另一个元组对象作为第八个元素来实现。可以使用Rest属性访问最后一个嵌套元组。要访问嵌套元组的元素，请使用Rest.Item1.Item<elelementNumber>属性。
```
var numbers = Tuple.Create(1, 2, 3, 4, 5, 6, 7, Tuple.Create(8, 9, 10, 11, 12, 13));
numbers.Item1; // 返回 1
numbers.Item7; // 返回 7
numbers.Rest.Item1; //返回(8,9,10,11,12,13)
numbers.Rest.Item1.Item1; //返回 8
numbers.Rest.Item1.Item2; //返回 9
```
您可以在序列中的任何位置包括嵌套元组对象。但是，建议将嵌套的元组放在序列的末尾，以便可以使用Rest属性访问它。
```
var numbers = Tuple.Create(1, 2, Tuple.Create(3, 4, 5, 6, 7,  8), 9, 10, 11, 12, 13 );
numbers.Item1; // 返回 1
numbers.Item2; // 返回 2
numbers.Item3; // 返回 (3, 4, 5, 6, 7,  8)
numbers.Item3.Item1; // 返回 3
numbers.Item4; // 返回 9
numbers.Rest.Item1; //返回13
```
元组作为方法参数
方法可以将元组作为参数。
```
static void Main(string[] args)
{    var person = Tuple.Create(1, "Steve", "Jobs");
    DisplayTuple(person);
}

static void DisplayTuple(Tuple<int,string,string> person)
{
    Console.WriteLine($"Id = { person.Item1}");
    Console.WriteLine($"First Name = { person.Item2}");
    Console.WriteLine($"Last Name = { person.Item3}");
}
```
元组作为返回类型
元组可以从方法返回。
```
static void Main(string[] args)
{    var person = GetPerson();
}
static Tuple<int, string, string> GetPerson() 
{    return Tuple.Create(1, "Bill", "Gates");
}
```
元组的用法
元组可以在以下情况下使用：

当您想从一个方法中返回多个值而不使用ref 或 out参数时。
当您想通过单个参数将多个值传递给方法时。
当您想暂时保存数据库记录或某些值而不创建单独的类时。。
元组缺点：
Tuple是一个引用类型，而不是一个值类型。它在堆上分配，并可能导致CPU密集型操作。
Tuple被限制为包括八个元素。如果需要存储更多元素，则需要使用嵌套元组。但是，这可能导致歧义。
可以使用名称模式 Item <elementNumber> 的属性访问Tuple元素，这是不太合理的。

 [原文地址](https://blog.csdn.net/weixin_44231544/article/details/122495459)
  
