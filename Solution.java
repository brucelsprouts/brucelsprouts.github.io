import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        helper(root, result);
        return result;
    }

    private void helper(TreeNode root, List<Integer> result) {
        if (root != null) {
            // First recur for left subtree
            helper(root.left, result);

            // Then add the value of the node
            result.add(root.val);

            // Finally recur for the right subtree
            helper(root.right, result);
        }
    }
}
