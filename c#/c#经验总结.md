# 总结c#中遇到的技巧经验 

## c# LINQ
昨天遇到一个问题，要从一个Dictionary<int,int>的key中找到最小的那个key，一开始想只有遍历来找，然后搜到一个用c#
语言集成查询 (LINQ)的方法，记录一下。

*语言集成查询 (LINQ) 是一系列直接将查询功能集成到 C# 语言的技术统称。借助 LINQ，查询成为了最高级的语言构造，就像类、方法和事件一样。LINQ 系列技术提供了针对对象 (LINQ to Objects)、关系数据库 (LINQ to SQL) 和 XML (LINQ to XML) 的一致查询体验。*

**根据需求 可以用from n in dict where 过滤表达式 orderby 排序 select 投影(选择) 来找到最小的key**
```
Dictionary<int,int>dict = new Dictionary<int,int>();
int minKey = (from d in dict orderby d.Key ascending select d.Key).First();
```


Linq查询语法:

1、扩展方法语法：扩展方法+lambda表达式

2、声明式查询语法：类型SQL查询方式

扩展方法语法(传输链)：IEnumerabl<T> query=源集合.Where(过滤，必须bool表达式).OrderBy(排序条件).Select(选择条件)

查询表达式：

var 结果集 = from n in 数据源  where 过滤表达式 orderby 排序 select 投影(选择)
查询表达式需以select或者group结束！
lambda表达式是对匿名方法的简化,任何匿名方法使用的场合lambda表达式都可以替代，并且代码更加简洁。lambda表达式会广泛用于LINQ中。lambda表达式的形式如下: 
*①无参的：()=>{处理语句}； 
②一个参数的：参数=>{处理语句}； 
③多个参数的：(参数1,参数2,…参数n)=>{处理语句}。 
备注：一条处理语句，{}可以省略！ 

关键字:
from...in...：指定要查找的数据以及范围变量，多个from子句则表示从多个数据源查找数据。注意：C#编译器会把"复合from子句"的查询表达式转换为SelectMany()扩展方法
join...in...on...equals...：指定多个数据源的关联方式
let：引入用于存储查询表达式中子表达式结果的范围变量，通常能达到层次感会更好，使代码更易于月的
orderby、descending：指定元素的排序字段和排序方式，当有多个排序字段时，由字段顺序确定主次关系，可指定升序和降序两种排序方式
where：指定元素的筛选条件，多个where子句则表示了并列条件，必须全部都满足才能入选，每个where子句可以使用&&、||连接多个条件表达式
group：指定元素的分组字段
select：指定查询要返回的目标数据，可以指定任何类型，甚至是匿名类型（目前通常被指定为匿名类型）
into：提供一个临时的标识符，该标识符可以引用join、group和select子句的结果。(1)直接出现在join子句之后的into关键字会被翻译为GroupJoin。(2)select或group子句字后的into它会重新开始一个查询，让我们可以继续引入where、orderby和select子句，它是对分步构建查询表达式的一种简写方式。

***

## & 运算符

以前判断奇偶都是对2取余 %2，今天看到一种用&来判断奇偶的方法。

>二元“&”：
为整型和 bool 类型预定义了二进制 & 运算符：
对于整型，& 计算操作数的逻辑按位“与”,相同位上，当且仅当两个操作数都为1时，结果才为1，其它都是0；注意0&0还是0,不是1.

判断奇偶时，只需要和1进行与运算，非0为奇数，0则为偶数

```
int a = 3;
int result = a&1;//3二进制是00…0011，1二进制是00…001，和3进行比较，&结果是二进制00…001。最终结果转为int就是1.
```