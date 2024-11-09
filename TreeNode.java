public class TreeNode {
    int value;
    TreeNode left, right;

    TreeNode(int value) {
        this.value = value;
        left = right = null;
    }
}

public class BSTFromPreOrder {
    public TreeNode constructBST(int[] preOrderList) {
        if (preOrderList.length == 0) {
            return null;
        }

        TreeNode root = new TreeNode(preOrderList[0]);
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);

        for (int i = 1; i < preOrderList.length; i++) {
            TreeNode node = new TreeNode(preOrderList[i]);

            if (node.value < stack.peek().value) {
                stack.peek().left = node;
                stack.push(node);
            } else {
                TreeNode lastPoppedNode = null;
                while (!stack.isEmpty() && node.value > stack.peek().value) {
                    lastPoppedNode = stack.pop();
                }
                lastPoppedNode.right = node;
                stack.push(node);
            }
        }

        return root;
    }
}