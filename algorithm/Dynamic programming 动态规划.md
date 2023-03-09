# 动态规划

动态规划（英语：Dynamic programming，简称 DP），是一种在数学、管理科学、计算机科学、经济学和生物信息学中使用的，通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。动态规划常常适用于有重叠子问题和最优子结构性质的问题。

动态规划最核心的思想，就在于拆分子问题，记住过往，减少重复计算。(也是一种空间换时间)

来看一道相对简单的动态规划问题

[ 47. 礼物的最大价值](https://leetcode.cn/problems/li-wu-de-zui-da-jie-zhi-lcof/)

```
在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

 

示例 1:

输入: 
[
  [1,3,1],
  [1,5,1],
  [4,2,1]
]
输出: 12
解释: 路径 1→3→5→2→1 可以拿到最多价值的礼物

```

我第一时间想到的是递归：
```
public class Solution {
    public int MaxValue(int[][] grid) {
        return GetMax(0,0,grid);
    }

    private int GetMax(int row , int col, int[][] grid){
        int right = 0;
        int down = 0;
        if (row < grid.Length - 1)
        {
            down = GetMax(row + 1,col , grid);
        }
        if (col < grid[0].Length - 1)
        {
            right = GetMax(row ,col + 1 , grid);
        }
        return grid[row][col] + Math.Max(right,down);
    }
}
```

每次递归返回下或右更大的一个加上当前位置的值。逻辑是没问题，但是会发现超出时间限制

具体分析一下，每个节点往下或右递归都要重新计算一次其路径上的值，复杂度是指数型的，存在大量的重复计算

所以，接下来就是空间换时间了，把已经计算过的位置记录下来，避免重复计算

```
public class Solution {
    private Dictionary<string,int> dict = new Dictionary<string,int>();
    public int MaxValue(int[][] grid) {
        return GetMax(0,0,grid);
    }

    private int GetMax(int row , int col, int[][] grid){
        if (dict.ContainsKey(row+"-"+col))
        {
           return dict[row+"-"+col];
        }
        int right = 0;
        int down = 0;
        if (row < grid.Length - 1)
        {
            down = GetMax(row + 1,col , grid);
        }
        if (col < grid[0].Length - 1)
        {
            right = GetMax(row ,col + 1 , grid);
        }
        int max = grid[row][col] + Math.Max(right,down);
        dict.TryAdd(row+"-"+col,max);
        return max;
    }
}
```

这样确实通过了，但是仔细想想，虽然避免了重复计算，但是递归时依然有很多判断要执行，且过程中会产生很多空间浪费







