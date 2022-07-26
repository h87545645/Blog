# 跳表 SkipList

跳表（Skiplist）是一个特殊的链表，相比一般的链表，有更高的查找效率，可比拟二叉查找树，平均期望的查找、插入、删除时间复杂度都是O(logn)

先看看跳表的节点类

```
  class SkiplistNode{
        public int val;
        public SkiplistNode[] forward;
        public SkiplistNode(int val,int maxLevel){
            this.val = val;
            this.forward = new SkiplistNode[maxLevel];
        }
    }
```

跳表的基础部分和链表类似，如下图，30 ，40 ，50，60 ... 就是每个节点 ，不同的是，每个几点指向下个节点的指针变成了数组`forward`，数组有值的长度就是这个节点的level等级数，比如值为30的节点，它的`forward`下标0，1，2都指下个后面某个节点的`forward`0，1，2

![skiplist](https://github.com/h87545645/Blog/blob/main/image/skiplist.png "skiplist")

跳表的查询类似数组的二分查找，从高level开始找离目标值最近的节点，从而提高查询效率

```
    public bool Search(int target) {
        
        
        SkiplistNode cur = this.head;
        //从最大level往下搜索路径
        for (int i = level - 1; i >= 0; i--)
        {
            //找到每层小于且最接近 target 的元素 
            while(cur.forward[i] != null && cur.forward[i].val < target){
                cur = cur.forward[i];
            }
        }
        cur = cur.forward[0];
        if (cur!= null && cur.val == target)
        {
            return true;
        }
        return false;
    }
```
从最大level往下遍历，每一层都找最接近`target`的节点，到level 0 时，`cur`的`forward[0]`就是目标值

添加节点也是遍历level,但是需要用数组`update`记录每一层最接近`target`的节点，然后随机决定是否这个节点需要增加level,如果需要，则将新节点forward指向`update`的forward 而`update`中的forward指向新节点。
```
  public void Add(int num) {
        //update 用于记录搜索路径中所有的SkiplistNode
        SkiplistNode[] update = new SkiplistNode[MAX_LEVEL];
        Array.Fill(update, head);
        SkiplistNode cur = this.head;
        //从最大level往下搜索路径
        for (int i = level - 1; i >= 0; i--)
        {
            while(cur.forward[i] != null && cur.forward[i].val < num){
                cur = cur.forward[i];
            }
            update[i] = cur;
        }
        int lv = this.GetRandom();
        this.level = Math.Max(lv,this.level);
        SkiplistNode newNode = new SkiplistNode(num,lv);
        for(int i =0;i<lv;i++){
            newNode.forward[i] = update[i].forward[i];
            update[i].forward[i] = newNode;
        }
    }
```


