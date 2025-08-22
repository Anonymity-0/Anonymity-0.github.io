---
title: 岛屿问题
slug: island-problem-z146jso
url: /post/island-problem-z146jso.html
date: '2025-08-21 21:05:27+08:00'
lastmod: '2025-08-21 21:05:45+08:00'
tags:
  - dfs
categories:
  - leetcode
keywords: dfs
toc: true
isCJKLanguage: true
---



# 岛屿问题

很久没有写leetcode了，秋招收到淘天的突然约面才发现，真的要重拾八股和leetcode了！

那就用岛屿数量复健，leetcode上有一个写的非常非常好的题解，我就直接跟着他的思路来走

### DFS 的基本结构

网格结构要比二叉树结构稍微复杂一些，它其实是一种简化版的图结构。要写好网格上的 DFS 遍历，我们首先要理解二叉树上的 DFS 遍历方法，再类比写出网格结构上的 DFS 遍历。我们写的二叉树 DFS 遍历一般是这样的：

```JavaScript
void traverse(TreeNode root) {
    // 判断 base case
    if (root == null) {
        return;
    }
    // 访问两个相邻结点：左子结点、右子结点
    traverse(root.left);
    traverse(root.right);
}
```

可以看到，二叉树的 DFS 有两个要素：「访问相邻结点」和「判断 base case」。

第一个要素是**访问相邻结点**。二叉树的相邻结点非常简单，只有左子结点和右子结点两个。二叉树本身就是一个递归定义的结构：一棵二叉树，它的左子树和右子树也是一棵二叉树。那么我们的 DFS 遍历只需要递归调用左子树和右子树即可。

第二个要素是 **判断 base case**。一般来说，二叉树遍历的 base case 是 root \=\= null。这样一个条件判断其实有两个含义：一方面，这表示 root 指向的子树为空，不需要再往下遍历了。另一方面，在 root \=\= null 的时候及时返回，可以让后面的 root.left 和 root.right 操作不会出现空指针异常。

对于网格上的 DFS，我们完全可以参考二叉树的 DFS，写出网格 DFS 的两个要素：

首先，网格结构中的格子有多少相邻结点？答案是上下左右四个。对于格子 (r, c) 来说（r 和 c 分别代表行坐标和列坐标），四个相邻的格子分别是 (r-1, c)、(r+1, c)、(r, c-1)、(r, c+1)。换句话说，网格结构是「四叉」的。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NWQ2ZTMxMjllM2NmY2FmYzYwZTEzMWE5NGM5N2Q3ZDNfbkk1b1pHRDFIczNBazlENE5VUUtBcExiUWNVY1pNT1lfVG9rZW46T0drNmJnUFNob01HMVB4OEx0RGN3NW0ybjBiXzE3NTU3ODE1MjE6MTc1NTc4NTEyMV9WNA)

其次，网格 DFS 中的 base case 是什么？从二叉树的 base case 对应过来，应该是网格中不需要继续遍历、grid[r][c] 会出现数组下标越界异常的格子，也就是那些超出网格范围的格子。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MmI1Njk1NjRjZmQ4NzUzZDIyOWQ1ZTRmYjRlOGNlNWZfYjZxWnp2VElRQ1owZ2lLbEh5T3JzdFR0ZFAzc1dFYkJfVG9rZW46WllBRGJDNU1zb3E5dFh4bTJITWNjN2dybmljXzE3NTU3ODE1MjE6MTc1NTc4NTEyMV9WNA)

这样，我们得到了网格 DFS 遍历的框架代码：

```Java
void dfs(int[][] grid, int r, int c) {
    // 判断 base case
    // 如果坐标 (r, c) 超出了网格范围，直接返回
    if (!inArea(grid, r, c)) {
        return;
    }
    // 访问上、下、左、右四个相邻结点
    dfs(grid, r - 1, c);
    dfs(grid, r + 1, c);
    dfs(grid, r, c - 1);
    dfs(grid, r, c + 1);
}

// 判断坐标 (r, c) 是否在网格中
boolean inArea(int[][] grid, int r, int c) {
    return 0 <= r && r < grid.length 
                && 0 <= c && c < grid[0].length;
}
```

网格结构的 DFS 与二叉树的 DFS 最大的不同之处在于，遍历中可能遇到遍历过的结点。这是因为，网格结构本质上是一个「图」，我们可以把每个格子看成图中的结点，每个结点有向上下左右的四条边。在图中遍历时，自然可能遇到重复遍历结点。

这时候，DFS 可能会不停地「兜圈子」，永远停不下来，如下图所示：

如何避免这样的重复遍历呢？答案是标记已经遍历过的格子。以岛屿问题为例，我们需要在所有值为 1 的陆地格子上做 DFS 遍历。每走过一个陆地格子，就把格子的值改为 2，这样当我们遇到 2 的时候，就知道这是遍历过的格子了。也就是说，每个格子可能取三个值：

0 —— 海洋格子

1 —— 陆地格子（未遍历过）

2 —— 陆地格子（已遍历过）

```Java
void dfs(int[][] grid, int r, int c) {
    // 判断 base case
    if(r<0||r>=grid.length||c<0||c>=grid[0].length) return;
    
    // 如果这个格子不是岛屿，直接返回
    if (grid[r][c] != 1) {
        return;
    }
    grid[r][c] = 2; // 将格子标记为「已遍历过」
    // 访问上、下、左、右四个相邻结点
    dfs(grid, r - 1, c);
    dfs(grid, r + 1, c);
    dfs(grid, r, c - 1);
    dfs(grid, r, c + 1);
}
```

这样，我们就得到了一个岛屿问题、乃至各种网格问题的通用 DFS 遍历方法。以下几个题，其实都只需要在 DFS 遍历框架上稍加修改而已。

# [岛屿数量](https://leetcode.cn/problems/number-of-islands/)

先来个最经典的岛屿数量，本质上它只是要岛屿的数量，所以和找到的第一个岛屿临近的1都要插上旗子。

```Java
class Solution {
    public int numIslands(char[][] grid) {
        int ans = 0;
        for(int i = 0;i<grid.length;i++){
            for(int j= 0;j<grid[0].length;j++){
                if(grid[i][j]=='1'){
                    ans+=1;
                    dfs(grid,i,j);
                }
            }
        }
        return ans;
    }
    
    private void dfs(char[][] grid,int r,int c){
        if(r<0||r>=grid.length||c<0||c>=grid[0].length) return;

        if(grid[r][c]!='1') return;

        grid[r][c] = '2';
        dfs(grid,r-1,c);
        dfs(grid,r+1,c);
        dfs(grid,r,c-1);
        dfs(grid,r,c+1);
    }
}
```

# [岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/)

这题就需要dfs的时候返回值了，但是其实每次插旗子就是岛屿的面积加一，所以我们只需要记录下每次插旗的数量并返回就好了。如果碰到的不是岛屿或者超过边界就返回0,注意最后return的时候带上自己的1.

```Java
class Solution {
    public int maxAreaOfIsland(int[][] grid) {
        int ans = 0;
        for(int i = 0 ;i<grid.length;i++){
            for(int j = 0; j<grid[0].length;j++){
                if(grid[i][j]==1){
                    ans = Math.max(area(grid,i,j),ans);
                }
            }
        }
        return ans;
    }
    private int area(int[][] grid,int r,int c){
        if(r<0||r>=grid.length||c<0||c>=grid[0].length) return 0;

        if(grid[r][c]!=1) return 0;

        grid[r][c] = 2;

        return 1+area(grid,r-1,c)+area(grid,r+1,c)+area(grid,r,c-1)+area(grid,r,c+1);
    }
}
```

# [463. 岛屿的周长](https://leetcode.cn/problems/island-perimeter/)

这题就比较陷阱，一开始路径依赖一看到岛屿就会用dfs，其实不然，让我们观察一下，边长的部分都是黄色的部分，他们一侧是岛屿，一侧是湖或者边界外。

那其实就很简单了，遍历整个图，如果当前是岛屿，那么我们就判断他上下左右的情况就好了

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YWJhZWQ4ODJiMDJjMWZiZGJhOGExNTg0YmQ3ZDAzZmZfeEswdlI1aVJ1U1B1MTZOMTRaRzlFbno0UmRYbG9KdmNfVG9rZW46SGt3UWJONUtmbzZFU2J4TmlMS2NLR3F2bmlkXzE3NTU3ODE1MjE6MTc1NTc4NTEyMV9WNA)

```Java
class Solution {
    public int islandPerimeter(int[][] grid) {
        int ans = 0;
        for(int i = 0;i<grid.length;i++){
            for(int j = 0;j<grid[0].length;j++){
                if(grid[i][j]==0){
                    continue;
                }
                // 如果在第一列，左边一定是周长的一部分
                // 如果左边是海，那左边也是周长的一部分
                if(j==0||grid[i][j-1]==0) ans++;

                // 如果在第一行，上边一定是周长的一部分
                // 如果上边是海，那上边也是周长的一部分
                if(i==0||grid[i-1][j]==0) ans++;

                // 如果在最后一行，下边一定是周长的一部分
                // 如果下边是海，那下边也是周长的一部分
                if(i==grid.length-1||grid[i+1][j]==0) ans++;

                // 如果在最后一列，右边一定是周长的一部分
                // 如果右边是海，那右边也是周长的一部分
                if(j==grid[0].length-1||grid[i][j+1]==0) ans++;
            }
        }
        return ans;
    }
}
```
