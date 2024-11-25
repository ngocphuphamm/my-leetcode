class Solution {
    public int[] mostCompetitive(int[] nums, int k) {
        Stack<Integer> stack = new Stack<Integer>();
        for(int i =0; i < nums.length; i++){
            int num = nums[i];
            while(!stack.isEmpty() 
            &&
            stack.peek() > num
            )
            {
                stack.pop();
            }
            if(stack.size() == k && stack.peek() < num){
                continue;
            }
            stack.add(num);
        }

        int[] result = new int[k];
        int i = 0;
        for(int num : stack){
            result[i] = num;
            i++;
        }
        return result;
    }
}
      x
0 1 2 3 4
3 5 2 6 2
3 5 2 
  5 2 6

4 - 1 - 1 = 2
stack.peek() = 1
2 + 1 = 3 == 3 
 
5 - 3 = 2
can pop maximum 2 

2,4,3,3,5,4,9,6

[2,3,3,4]