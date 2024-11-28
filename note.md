/*
TC: O(n^2logn)
space: n^2
*/
class Solution {
    int modulo = 1_000_000_007;
    class Pair{
        int idx; 
        int sum;
        Pair(int idx, int sum){
            this.idx = idx;
            this.sum = sum;
        }
    }
    public int rangeSum(int[] nums, int n, int left, int right) {
       PriorityQueue<Pair> minHeap = new PriorityQueue<Pair>((a,b)->a.sum - b.sum);
       for(int i = 0; i < n;i++){
            minHeap.add(new Pair(i + 1, nums[i]));
       }

       int result = 0;
       for(int i = 1; i < right;i++){
            Pair pair = minHeap.poll();
            if(pair.idx >= left){
                result = (int) (result +  pair.sum) % modulo;
            }
            if(pair.idx < n - 1){
                pair.sum += nums[pair.idx + 1];
                minHeap.add(pair);
            }
       }
       return result;
    }
}


