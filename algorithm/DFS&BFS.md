# 深度优先遍历与广度优先遍历


深度优先遍历DFS
DFS属于图算法的一种，是针对图和树的遍历算法。深度优先搜索是图论中的经典算法，利用深度优先搜索算法可以产生目标图的相应拓扑排序表，利用拓扑排序表可以方便的解决很多相关的图论问题，如最大路径问题等等。一般用堆或栈来辅助实现DFS算法。其过程简要来说是对每一个可能的分支路径深入到不能再深入为止，如果遇到死路就往回退，回退过程中如果遇到没探索过的支路，就进入该支路继续深入，每个节点只能访问一次。

深度优先搜索多使用递归回溯的写法，先递归到最深的节点，再回溯到开头重复这一步骤，比如先序遍历，中序遍历，后序遍历

例
```
void DFS(Node root)
{
	if (root == null)
    {
        return;
    }

    Console.WriteLine(root.Val);
    
    DFS1(root.Left);
    DFS1(root.Right);
}

```





广度优先遍历BFS
广度优先搜索（也称宽度优先搜索）是连通图的一种遍历算法，也是很多重要的图的算法的原型。Dijkstra单源最短路径算法和Prim最小生成树算法都采用了和广度优先搜索类似的思想。属于一种盲目搜寻法，目的是系统地展开并检查图中的所有节点，以找寻结果。换句话说，它并不考虑结果的可能位置，彻底地搜索整张图，直到找到结果为止。基本过程，BFS是从根节点开始，沿着树(图)的宽度遍历树(图)的节点。如果所有节点均被访问，则算法中止。一般用队列数据结构来辅助实现BFS算法。


例
```
public BFS(TreeNode root) {
    Queue<TreeNode> temp = new Queue<TreeNode>();
    temp.Enqueue(root);
    while(temp.Count > 0){
        TreeNode nd = temp.Dequeue();
        Console.WriteLine(nd.Val);
        if (nd.left != null)
        {
                temp.Enqueue(nd.left);
        }
        if (nd.right != null)
        {
                temp.Enqueue(nd.right);
        }
    }
}

```
