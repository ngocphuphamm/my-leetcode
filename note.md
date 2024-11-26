class Solution {
    public int minPairSum(int[] nums) {
        Arrays.sort(num);

        int left =0, right = nums.length - 1;
        return nums[left] + nums[right];
    }
}